import { useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { Button } from "../../components/Button";
import { CellsCard } from "../../components/Cards/Cells";
import { Layout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import * as S from "./styles";
import api from "../../services/api";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  address: string;
  dateLabel: string;
  imgId: string;
}

interface CellsData {
  id: string;
  name: string;
  address: string;
  imgId: string;
  img: {
    url: string;
  } | null;
  dateLabel: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageUploadResponse {
  data: {
    id: string;
  };
  id: string;
}

export const CellsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingCells, setEditingCells] = useState<CellsData | null>(null);
  const [listCells, setListCells] = useState<CellsData[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [userGroups, setUserGroups] = useState<CellsData[] | null>(null);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  const queryClient = useQueryClient();
  const handleImageChange = (cell: React.ChangeEvent<HTMLInputElement>) => {
    const file = cell.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      let imgUpload: File | string | null = selectedImage;

      if (!selectedImage) {
        if (listCells && listCells.length > 0) {
          imgUpload = listCells[0].imgId || "";
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

      const cellsData = {
        ...data,
        imgId: imgUpload,
      };

      if (editingCells) {
        await api.put(`/group/${editingCells.id}`, cellsData);
      } else {
        await api.post("/group", cellsData);
      }

      setIsModalOpen(false);
      toast.success(
        editingCells
          ? "Célula editada com sucesso!"
          : "Célula cadastrada com sucesso!"
      );
      reset();

      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar/editar Célula: " + error);
    } finally {
      queryClient.invalidateQueries("getCellsList");
      setLoading(false);
    }
  };

  const handleEdit = (cells: CellsData) => {
    setEditingCells(cells);
    setValue("name", cells.name);
    setValue("address", cells.address);
    setValue("dateLabel", cells.dateLabel);
    setIsModalOpen(true);
  };

  const GET_CELLS_LIST = async () => {
    const response = await api.get<{ groups: CellsData[] }>("/group", {
      params: { search: searchQuery }, // Add search query parameter
    });
    setListCells(response.data.groups);
    return response.data.groups;
  };

  const getUserGroups = async () => {
    try {
      const response = await api.get<{ groups: CellsData[] }>("/group/me");
      setUserGroups(response.data.groups);
      console.log(response.data.groups);
    } catch (error) {
      console.error("Erro ao obter grupos do usuário:", error);
    }
  };

  const { data, isLoading } = useQuery(
    ["getCellsList", searchQuery],
    GET_CELLS_LIST
  );
  const filteredData =
    data?.filter((cell: CellsData) =>
      cell.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/group/${id}`);

      toast.success("Grupo excluido com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir Grupo:" + error);
    } finally {
      queryClient.invalidateQueries("getCellsList");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <S.ActionsNews>
        <h1>Células</h1>
        <label>
          Buscar Célula:
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        <Button variant="default" onClick={() => getUserGroups()}>
          Ver Meus Grupos
        </Button>

        <S.Actions>
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            Cadastrar Célula
          </Button>
        </S.Actions>
      </S.ActionsNews>
      <S.NewsWrapper>
        {isLoading && <span>Carregando células...</span>}

        {!isLoading && data && data.length === 0 && (
          <span>Não há células cadastradas.</span>
        )}

        {!isLoading &&
          !userGroups &&
          filteredData.length > 0 &&
          filteredData.map((cell: CellsData) => (
            <CellsCard
              key={cell.id}
              name={cell.name}
              address={cell.address}
              image={cell.img?.url || null}
              id={cell.id}
              dateLabel={cell.dateLabel}
              createdAt={cell.createdAt}
              updatedAt={cell.updatedAt}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}

        {userGroups &&
          userGroups.map((group) => (
            <CellsCard
              key={group.id}
              name={group.name}
              address={group.address}
              image={group.img?.url || null}
              id={group.id}
              dateLabel={group.dateLabel}
              createdAt={group.createdAt}
              updatedAt={group.updatedAt}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}
      </S.NewsWrapper>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Cadastrar/editar células</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Nome da Célula:
            <Input
              type="text"
              {...register("name", { required: "Este campo é obrigatório" })}
            />
            {errors.name && (
              <S.ErrorMessage>{errors.name.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Endereço da Célula:
            <Input
              type="text"
              {...register("address", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.address && (
              <S.ErrorMessage>{errors.address.message}</S.ErrorMessage>
            )}
          </label>
          <label>
            Data e Hora:
            <Input
              {...register("dateLabel", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.dateLabel && (
              <S.ErrorMessage>{errors.dateLabel.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Imagem:
            <S.InputImage
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <Button type="submit" variant="edit">
            {loading ? (
              <BeatLoader color={"#fff"} size={10} />
            ) : editingCells ? (
              "Editar"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </Modal>
    </Layout>
  );
};
