import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "../../components/Button";
import { NewsCard } from "../../components/Cards/News";
import { Layout } from "../../components/Layout";
import { Modal } from "../../components/Modal";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import { useForm, SubmitHandler } from "react-hook-form";

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
  img: {
    url: string;
  } | null;
  videoUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const NewsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await api.post("/news", data);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Erro ao cadastrar notícia:" + error);
    }
  };

  const GET_NEWS_LIST = async () => {
    const response = await api.get<{ news: NewsData[] }>("/news");
    return response.data.news;
  };

  const { data, isLoading } = useQuery("getEventList", GET_NEWS_LIST);

   const handleDelete = async (id: string) => {
     try {
       await api.delete(`/news/${id}`);

       toast.success("Notícia excluida com sucesso!");
     } catch (error) {
       toast.error("Erro ao excluir notícia:" + error);
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
               onEdit={() => handleEdit(event)}
               onDelete={handleDelete}
             />
           ))}
       </S.NewsWrapper>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
         <h2>Cadastrar notícias</h2>
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
             Descrição curta:
             <Input
               type="text"
               name="shortDescription"
               {...register("shortDescription", {
                 required: "Este campo é obrigatório",
               })}
             />
             {errors.shortDescription && (
               <S.ErrorMessage>
                 {errors.shortDescription.message}
               </S.ErrorMessage>
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

           <Button type="submit">Cadastrar</Button>
         </form>
       </Modal>
     </Layout>
   );
};
