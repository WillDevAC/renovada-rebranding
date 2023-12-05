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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Layout } from "../../components/Layout";
import * as S from "./styles";

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

interface FormData {
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get<{ users: User[] }>("/user");
      setUsers(data.users);
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
    setIsEditMode(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSaveUser: SubmitHandler<FormData> = async (data) => {
    try {
      let imgUpload: File | string | null = selectedImage;

      if (!selectedImage && users.length > 0) {
        imgUpload = users[0].avatarId || "";
      } else if (selectedImage) {
        const formData = new FormData();
        formData.append("file", imgUpload as File);

        const { data: imageResponse } = await api.post<ImageUploadResponse>(
          "/image/upload",
          formData
        );

        imgUpload = imageResponse.id;
      }

      const formattedData: FormData = {
        ...data,
        avatarId: imgUpload,
        cpf: data.cpf.replace(/[^\d]/g, ""),
        cep: data.cep.replace(/[^\d]/g, ""),
        number: data.number.replace(/[^\d]/g, ""),
      };

      if (isEditMode) {
        await api.put(`/user/${selectedUser?.id}`, formattedData);
      } else {
        await api.post("/user", formattedData);
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error("Error saving user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`user/${id}`);
      toast.success("Usuário deletado com sucesso!");
      fetchData();
    } catch (err) {
      toast.error("Ocorreu um erro ao deletar o usuário. Motivo:" + err);
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    const action = isActive ? "desactive" : "active";

    try {
      await api.put(`user/${action}/${id}`);
      const message = isActive ? "Usuário desativado" : "Usuário ativado";
      toast.success(message);
    } catch (err) {
      const message = isActive
        ? "Não foi possível desativar o usuário"
        : "Não foi possível ativar o usuário";
      toast.error(message);
    } finally {
      fetchData();
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    handleOpenModal();
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
                    <Button variant="edit" onClick={() => handleEditUser(user)}>
                      Editar
                    </Button>
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
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Cadastrar Usuário"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleSaveUser)}>
              <Controller
                name="name"
                control={control}
                defaultValue={selectedUser ? selectedUser.name : ""}
                render={({ field }) => (
                  <Input
                    label="Nome:"
                    {...field}
                    {...register("name", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue={selectedUser ? selectedUser.email : ""}
                render={({ field }) => (
                  <Input
                    label="E-mail:"
                    {...field}
                    {...register("email", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    label="Senha:"
                    type="password"
                    {...field}
                    {...register("password", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                )}
              />
              <Controller
                name="birthday"
                control={control}
                defaultValue={selectedUser ? selectedUser.birthday : ""}
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
                defaultValue={selectedUser ? selectedUser.gender : ""}
                render={({ field }) => (
                  <Select
                    label="Gênero:"
                    options={[
                      { value: "male", label: "Homem" },
                      { value: "female", label: "Mulher" },
                    ]}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
              <label>
                Imagem:
                <S.InputImage
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {/* Campos adicionais */}
              <Controller
                name="address"
                control={control}
                defaultValue={selectedUser ? selectedUser.address : ""}
                render={({ field }) => <Input label="Endereço:" {...field} />}
              />
              <Controller
                name="cpf"
                control={control}
                defaultValue={selectedUser ? selectedUser.cpf : ""}
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
                defaultValue={selectedUser ? selectedUser.number : ""}
                render={({ field }) => <Input label="Número:" {...field} />}
              />
              <Controller
                name="city"
                control={control}
                defaultValue={selectedUser ? selectedUser.city : ""}
                render={({ field }) => <Input label="Cidade:" {...field} />}
              />
              <Controller
                name="state"
                control={control}
                defaultValue={selectedUser ? selectedUser.state : ""}
                render={({ field }) => <Input label="Estado:" {...field} />}
              />
              <Controller
                name="complement"
                control={control}
                defaultValue={selectedUser ? selectedUser.complement : ""}
                render={({ field }) => (
                  <Input label="Complemento:" {...field} />
                )}
              />
              <Controller
                name="cep"
                control={control}
                defaultValue={selectedUser ? selectedUser.cep : ""}
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
                    label="Sou visitante"
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
                    label="Sou pastor"
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
                    label="Já aceitei Jesus"
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
                    label="Sou batizado"
                  />
                )}
              />

              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Cancelar
                </Button>
                <Button type="submit" color="primary">
                  {isEditMode ? "Atualizar" : "Salvar"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Modal>
      </Layout>
    </ThemeProvider>
  );
};
