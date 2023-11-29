import { useState } from "react";

import { useQuery, useQueryClient } from "react-query";

import { Button } from "../../components/Button";
import { NewsCard } from "../../components/Cards/News";
import { Layout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { useForm, SubmitHandler } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import * as S from "./styles";
import api from "../../services/api";
import { toast } from "react-toastify";

interface FormData {
  title: string;
  content: string;
  shortDescription: string;
  videoUrl: string;
  imgId: string;
}

interface NewsData {
  id: string;
  title: string;
  labelDate: string;
  imgId: string;
  img: {
    url: string;
  } | null;
  videoUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  shortDescription: string;
}

interface ImageUploadResponse {
  data: {
    id: string;
  };
}

export const NewsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingNews, setEditingNews] = useState<NewsData | null>(null);
  const [listNews, setListNews] = useState<FormData | null>(null);
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      let imgUpload = selectedImage;

      if (!selectedImage) {
        imgUpload = listNews[0].imgId;
      } else {
        const formData = new FormData();
        formData.append("file", imgUpload);

        const imageResponse = await api.post<ImageUploadResponse>(
          "/image/upload",
          formData
        );
        imgUpload = imageResponse.data.id;
      }

      const newsData = {
        ...data,
        imgId: imgUpload,
      };

      if (editingNews) {
        await api.put(`/news/${editingNews.id}`, newsData);
      } else {
        await api.post("/news", newsData);
      }

      setIsModalOpen(false);
      toast.success(
        editingNews
          ? "Notícia editada com sucesso!"
          : "Notícia cadastrada com sucesso!"
      );
      reset();

      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar/editar notícia: " + error);
    } finally {
      queryClient.invalidateQueries("getEventList");
      setLoading(false);
    }
  };

  const handleEdit = (news: NewsData) => {
    setEditingNews(news);
    setValue("title", news.title);
    setValue("content", news.content);
    setValue("shortDescription", news.shortDescription);
    setValue("videoUrl", news.videoUrl);
    setIsModalOpen(true);
  };

  const GET_NEWS_LIST = async () => {
    const response = await api.get<{ news: NewsData[] }>("/news");
    setListNews(response.data.news);
    return response.data.news;
  };

  const { data, isLoading } = useQuery("getEventList", GET_NEWS_LIST);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/news/${id}`);

      toast.success("Notícia excluida com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir notícia:" + error);
    } finally {
      queryClient.invalidateQueries("getEventList");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <S.ActionsNews>
        <h1>Notícias</h1>
        <S.Actions>
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            Cadastrar notícia
          </Button>
        </S.Actions>
      </S.ActionsNews>
      <S.NewsWrapper>
        {isLoading && <span>Carregando notícias...</span>}

        {!isLoading && data.length === 0 && (
          <span>Não há noticias cadastradas.</span>
        )}

        {!isLoading &&
          data.length > 0 &&
          data.map((event: NewsData) => (
            <NewsCard
              key={event.id}
              title={event.title}
              date={event.labelDate}
              image={event.img?.url || null}
              id={event.id}
              videoUrl={event.videoUrl}
              content={event.content}
              createdAt={event.createdAt}
              updatedAt={event.updatedAt}
              shortDescription={event.shortDescription}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          ))}
      </S.NewsWrapper>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Cadastrar/editar notícias</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Título:
            <Input
              type="text"
              name="title"
              {...register("title", { required: "Este campo é obrigatório" })}
            />
            {errors.title && (
              <S.ErrorMessage>{errors.title.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Descrição curta:
            <Input
              type="text"
              name="shortDescription"
              {...register("shortDescription", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.shortDescription && (
              <S.ErrorMessage>{errors.shortDescription.message}</S.ErrorMessage>
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
              name="videoUrl"
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
            ) : editingNews ? (
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
