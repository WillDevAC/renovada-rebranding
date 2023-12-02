import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Layout } from "../../components/Layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useForm, SubmitHandler, Controller } from "react-hook-form"; // Importe as funções necessárias
import InputMask from "react-input-mask";
import api from "../../services/api";
import { toast } from "react-toastify";
interface ImageUploadResponse {
  data: {
    id: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  avatarId: string;
  isActive: boolean;
}

interface FormInputs {
  name: string;
  email: string;
  password: string;
  birthday: string;
  gender: string;
  avatar: FileList;
  address: string;
  cpf: string;
  number: string;
  city: string;
  state: string;
  complement: string;
  cep: string;
  isVisitor: boolean;
  isShepherd: boolean;
  isAcceptedJesus: boolean;
  isBaptized: boolean;
  phone: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const usersResponse = await api.get<{ users: User[] }>("/user");
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // reset();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedImage(files);
    }
  };

  const handleSaveUser: SubmitHandler<FormInputs> = async (data) => {
    try {
      let imgUpload: File | string | null = selectedImage;

      if (!selectedImage) {
        if (users && users.length > 0) {
          imgUpload = users.avatarId || "";
        } else {
          imgUpload = "";
        }
      } else {
        const formData = new FormData();
        formData.append("file", imgUpload as File);

        const imageResponse = await api.post<ImageUploadResponse>(
          "/image/upload",
          formData
        );
        imgUpload = imageResponse.data.id;
      }

      const formattedData = {
        ...data,
        imgId: imgUpload,
        cpf: data.cpf.replace(/[^\d]/g, ""),
        cep: data.cep.replace(/[^\d]/g, ""),
        number: data.number.replace(/[^\d]/g, ""),
      };

      console.log("Data to be saved:", formattedData);
      await api.post("/user", formattedData);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`user/${id}`);
      toast.success("Usuário deletado com sucesso!");
    } catch (err) {
      toast.error("Occoreu um erro ao deletar o usuário. Motivo:" + err);
    } finally {
      fetchData();
    }
  };
  const desactiveUser = async (id: string) => {
    try {
      await api.put(`user/desactive/${id}`);
      toast.success("Usuário desativado");
    } catch (err) {
      toast.error("Não foi possivel desativar o usuário");
    } finally {
      fetchData();
    }
  };

  const activeUser = async (id: string) => {
    try {
      await api.put(`user/active/${id}`);
      toast.success("Usuário ativado");
    } catch (err) {
      toast.error("Não foi possivel ativar o usuário");
    } finally {
      fetchData();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography component="h1" variant="h4">
            Usuários
          </Typography>
          <Button variant="default" color="primary" onClick={handleOpenModal}>
            Cadastrar usuários
          </Button>
        </Box>
        <Container>
          <Grid container spacing={4}>
            {users.map((user) => (
              <Grid item key={user.id} xs={12} sm={6} md={4} lg={3} mt={4}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt={user.name}
                    src={user.avatar?.url}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {user.name}
                  </Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <Typography color="textSecondary">
                    {user.isActive == true
                      ? "O usuário esta: ativo"
                      : "O usuário esta: desativo"}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button variant="edit">Editar</Button>
                    <Button
                      variant="delete"
                      onClick={() => deleteUser(user.id)}
                    >
                      Excluir
                    </Button>
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="edit"
                      onClick={() =>
                        user.isActive == true
                          ? desactiveUser(user.id)
                          : activeUser(user.id)
                      }
                    >
                      {user.isActive == true
                        ? "Desativar usuário"
                        : "Ativar usuário"}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Modal isOpen={openModal} onClose={handleCloseModal}>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleSaveUser)}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="Nome:" {...field} />}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="E-mail:" {...field} />}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input label="Senha:" type="password" {...field} />
                )}
              />
              <Controller
                name="birthday"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputMask
                    mask="99/99/9999"
                    maskChar="_"
                    onChange={(e) => field.onChange(e)}
                    onBlur={(e) => field.onBlur(e)}
                    value={field.value}
                  >
                    {(inputProps) => (
                      <Input label="Data de nascimento:" {...inputProps} />
                    )}
                  </InputMask>
                )}
              />
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    label="Gênero:"
                    options={[
                      { value: "male", label: "Homem" },
                      { value: "female", label: "Mulher" }, // Corrigido o valor para "female"
                    ]}
                    value={field.value} // Adicione esta linha para definir o valor corretamente
                    onChange={(e) => field.onChange(e.target.value)} // Adicione esta linha para lidar com as alterações no valor
                  />
                )}
              />

              <Input type="file" label="Avatar:" onChange={handleImageChange} />

              <Controller
                name="address"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="Endereço:" {...field} />}
              />
              <Controller
                name="cpf"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputMask
                    mask="999.999.999-99"
                    maskChar="_"
                    onChange={(e) => field.onChange(e)}
                    onBlur={(e) => field.onBlur(e)}
                    value={field.value}
                  >
                    {(inputProps) => <Input label="CPF:" {...inputProps} />}
                  </InputMask>
                )}
              />

              <Controller
                name="number"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="Número:" {...field} />}
              />
              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="Cidade:" {...field} />}
              />
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => <Input label="Estado:" {...field} />}
              />
              <Controller
                name="complement"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input label="Complemento:" {...field} />
                )}
              />
              <Controller
                name="cep"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputMask
                    mask="99999-999"
                    maskChar="_"
                    onChange={(e) => field.onChange(e)}
                    onBlur={(e) => field.onBlur(e)}
                    value={field.value}
                  >
                    {(inputProps) => <Input label="CEP:" {...inputProps} />}
                  </InputMask>
                )}
              />
              <Controller
                name="isVisitor"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="É visitante?"
                  />
                )}
              />
              <Controller
                name="isShepherd"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="É pastor?"
                  />
                )}
              />
              <Controller
                name="isAcceptedJesus"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="Já aceitou Jesus?"
                  />
                )}
              />
              <Controller
                name="isBaptized"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="É batizado?"
                  />
                )}
              />
              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancelar
                </Button>
                <Button type="submit" color="primary">
                  Salvar
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Modal>
      </Layout>
    </ThemeProvider>
  );
};
