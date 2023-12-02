import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { Button } from "../../components/Button";
import { WordsCard } from "../../components/Cards/Words";
import { Layout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { useForm, SubmitHandler } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import * as S from "./styles";
import api from "../../services/api";
import { toast } from "react-toastify";
import Select from "../../components/Select";

interface FormData {
  title: string;
  content: string;
  author: string;
  videoUrl: string;
  imgId: string;
  type: string;
  categoryId: string;
}

interface WordsData {
  id: string;
  title: string;
  imgId: string;
  img: {
    url: string;
  } | null;
  videoUrl: string;
  author: string;
  content: string;
  type: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface ImageUploadResponse {
  data: {
    id: string;
  };
  id: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const WordsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingWords, setEditingWords] = useState<WordsData | null>(null);
  const [listWords, setListWords] = useState<WordsData[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  const queryClient = useQueryClient();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/wordSermon/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []); // O segundo argumento vazio garante que isso só seja executado uma vez no início

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      let imgUpload: File | string | null = selectedImage;

      if (!selectedImage) {
        if (listWords && listWords.length > 0) {
          imgUpload = listWords[0].imgId || "";
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

      const wordsData = {
        ...data,
        imgId: imgUpload,
      };

      if (editingWords) {
        await api.put(`/wordSermon/${editingWords.id}`, wordsData);
      } else {
        await api.post("/wordSermon", wordsData);
      }

      setIsModalOpen(false);
      toast.success(
        editingWords
          ? "Sermão editado com sucesso!"
          : "Sermão cadastrado com sucesso!"
      );
      reset();

      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar/editar Sermão: " + error);
    } finally {
      queryClient.invalidateQueries("getEventList");
      setLoading(false);
    }
  };

  const handleEdit = (words: WordsData) => {
    setEditingWords(words);
    setValue("title", words.title);
    setValue("content", words.content);
    setValue("author", words.author);
    setValue("videoUrl", words.videoUrl);
    setValue("type", words.type);
    setValue("categoryId", words.categoryId);
    setIsModalOpen(true);
  };

  const GET_WORDS_LIST = async () => {
    const response = await api.get(`/wordSermon`);
    setListWords(response.data.wordSermons);
    return response.data.wordSermons;
  };

  const { data, isLoading } = useQuery("getWordList", GET_WORDS_LIST);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/wordSermon/${id}`);

      toast.success("Sermão excluido com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir Sermão:" + error);
    } finally {
      queryClient.invalidateQueries("getWordList");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <S.ActionsNews>
        <h1>Palavras</h1>
        <S.Actions>
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            Cadastrar Palavras
          </Button>
        </S.Actions>
      </S.ActionsNews>
      <S.NewsWrapper>
        {isLoading && <span>Carregando Sermões...</span>}

        {!isLoading && data && data.length === 0 && (
          <span>Não há sermões cadastradas.</span>
        )}

        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((word: WordsData) => (
            <WordsCard
              key={word.id}
              title={word.title}
              type={word.type}
              image={word.img?.url || null}
              id={word.id}
              videoUrl={word.videoUrl}
              categoryId={word.categoryId}
              content={word.content}
              createdAt={word.createdAt}
              updatedAt={word.updatedAt}
              author={word.author}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}
      </S.NewsWrapper>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Cadastrar/editar Palavras</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Título:
            <Input
              type="text"
              {...register("title", { required: "Este campo é obrigatório" })}
            />
            {errors.title && (
              <S.ErrorMessage>{errors.title.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Autor:
            <Input
              type="text"
              {...register("author", { required: "Este campo é obrigatório" })}
            />
            {errors.author && (
              <S.ErrorMessage>{errors.author.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Categoria do Sermão
            <Select
              {...register("categoryId", {
                required: "Este campo é obrigatório",
              })}
              options={(Array.isArray(categories) ? categories : []).map(
                (category) => ({
                  value: category.id,
                  label: category.title,
                })
              )}
            />
            {errors.categoryId && (
              <S.ErrorMessage>{errors.categoryId.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Tipo de Vídeo
            <Select
              {...register("type", {
                required: "Este campo é obrigatório",
              })}
              options={[
                { value: "video", label: "video" },
                { value: "short", label: "Short" },
              ]}
            />
            {errors.type && (
              <S.ErrorMessage>{errors.type.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Conteúdo:
            <TextArea
              rows={4}
              cols={50}
              {...register("content", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.content && (
              <S.ErrorMessage>{errors.content.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            URL do vídeo:
            <Input
              type="text"
              {...register("videoUrl", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.videoUrl && (
              <S.ErrorMessage>{errors.videoUrl.message}</S.ErrorMessage>
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
            ) : editingWords ? (
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
