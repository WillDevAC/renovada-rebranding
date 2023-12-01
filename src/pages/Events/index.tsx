// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "../../components/Button";
import { EventCard } from "../../components/Cards/Event";
import { Layout } from "../../components/Layout";
import { useQueryClient } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";

import * as S from "./styles";
import api from "../../services/api";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";
import { Modal } from "../../components/Modal";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
interface FormData {
  title: string;
  content: string;
  videoUrl: string;
  imgId: string;
  labelDate: string;
  address: string;
  date: string;
  price: number;
  isRequiredSubscription: boolean;
  maxRegistered: number;
  SubscribersEvent: object;
  isHighlighted: boolean;
}

interface EventsData {
  id: string;
  img: {
    url: string;
  } | null;
  title: string;
  content: string;
  videoUrl: string;
  imgId: string;
  labelDate: string;
  address: string;
  date: string;
  price: string;
  isRequiredSubscription: boolean;
  maxRegistered: number;
  isHighlighted: boolean;
  SubscribersEvent: object;
  createdAt: string;
  updatedAt: string;
}

interface ImageUploadResponse {
  data: {
    id: string;
  };
  id: string;
}

export const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading] = useState<boolean>(false);
  const [editingEvents, setEditingEvents] = useState<EventsData | null>(null);
  const [listEvents, setListEvents] = useState<EventsData[] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const queryClient = useQueryClient();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      let imgUpload: File | string | null = selectedImage;

      if (!selectedImage) {
        if (listEvents && listEvents.length > 0) {
          imgUpload = listEvents[0].imgId || "";
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
      const eventsData = {
        ...data,
        imgId: imgUpload,
      };

      eventsData.isRequiredSubscription = data.isRequiredSubscription;
      eventsData.isHighlighted = data.isHighlighted;

      eventsData.price = parseFloat(data.price.toString()) || 0;
      eventsData.maxRegistered = parseFloat(data.maxRegistered.toString()) || 0;

      if (editingEvents) {
        await api.put(`/event/${editingEvents.id}`, eventsData);
      } else {
        await api.post("/event", eventsData);
      }

      await queryClient.refetchQueries("getEventList");
      setIsModalOpen(false);
      toast.success("Evento Cadastrado");
    } catch (error) {
      toast.error("Erro ao cadastrar evento:" + error);
    }
  };

  const handleEdit = (event: EventsData) => {
    setEditingEvents(event);
    setValue("title", event.title);
    setValue("content", event.content);
    setValue("videoUrl", event.videoUrl);
    setValue("labelDate", event.labelDate);
    setValue("address", event.address);
    setValue("date", event.date);
    const priceValue = parseFloat(event.price);
    setValue("price", isNaN(priceValue) ? 0 : priceValue);
    setValue("isRequiredSubscription", event.isRequiredSubscription);
    setValue("maxRegistered", event.maxRegistered);
    setValue("SubscribersEvent", event.SubscribersEvent);
    setValue("isHighlighted", event.isHighlighted);
    setIsModalOpen(true);
  };

  const GET_EVENTS_LIST = async () => {
    const response = await api.get(`/event`);
    setListEvents(response.data.news);
    return response.data.events;
  };

  const { data, isLoading } = useQuery("getEventList", GET_EVENTS_LIST);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/event/${id}`);
      await queryClient.refetchQueries("getEventList");

      toast.success("Evento excluido com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir Evento:" + error);
    }
  };

  return (
    <Layout>
      <S.ActionsEvents>
        <h1>Eventos</h1>
        <S.Actions>
          <Button variant="default" onClick={() => setIsModalOpen(true)}>
            Cadastrar evento
          </Button>
        </S.Actions>
      </S.ActionsEvents>
      <S.EventsWrapper>
        {isLoading && <span>Carregando eventos...</span>}

        {!isLoading && data?.length === 0 && (
          <span>Não há eventos cadastrados.</span>
        )}

        {!isLoading ? (
          data?.length > 0 ? (
            data.map((event: EventsData) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                labelDate={event.labelDate}
                address={event.address}
                isRequiredSubscription={event.isRequiredSubscription}
                maxRegistered={event.maxRegistered}
                isHighlighted={event.isHighlighted}
                image={event.img?.url || null}
                id={event.id}
                videoUrl={event.videoUrl}
                price={event.price}
                content={event.content}
                createdAt={event.createdAt}
                SubscribersEvent={event.SubscribersEvent || []}
                updatedAt={event.updatedAt}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <span>Não há eventos cadastrados.</span>
          )
        ) : null}
      </S.EventsWrapper>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Cadastrar notícias</h2>
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
            Conteúdo do Evento:
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
            Data e Hora:
            <Input
              type="text"
              {...register("labelDate", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.labelDate && (
              <S.ErrorMessage>{errors.labelDate.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Endereço:
            <Input
              type="text"
              {...register("address", { required: "Este campo é obrigatório" })}
            />
            {errors.address && (
              <S.ErrorMessage>{errors.address.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Data do Evento:
            <Input
              type="text"
              {...register("date", { required: "Este campo é obrigatório" })}
            />
            {errors.date && (
              <S.ErrorMessage>{errors.date.message}</S.ErrorMessage>
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

          <label>
            É Necessário se Inscrever para Participar:
            <Select
              {...register("isRequiredSubscription", {
                required: "Este campo é obrigatório",
              })}
              options={[
                { value: true, label: "Sim" },
                { value: false, label: "Não" },
              ]}
            />
            {errors.isRequiredSubscription && (
              <S.ErrorMessage>
                {errors.isRequiredSubscription.message}
              </S.ErrorMessage>
            )}
          </label>

          <label>
            Máximo de Participantes:
            <Input
              type="number"
              {...register("maxRegistered", {
                required: "Este campo é obrigatório",
              })}
            />
            {errors.maxRegistered && (
              <S.ErrorMessage>{errors.maxRegistered.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Preço (Se houver):
            <Input
              type="number"
              {...register("price", { required: "Este campo é obrigatório" })}
            />
            {errors.price && (
              <S.ErrorMessage>{errors.price.message}</S.ErrorMessage>
            )}
          </label>

          <label>
            Evento em Destaque:
            <Select
              {...register("isHighlighted", {
                required: "Este campo é obrigatório",
              })}
              options={[
                { value: true, label: "Sim" },
                { value: false, label: "Não" },
              ]}
            />
            {errors.isHighlighted && errors.isHighlighted.message && (
              <S.ErrorMessage>{errors.isHighlighted.message}</S.ErrorMessage>
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

          <Button type="submit" variant="edit">
            {loading ? (
              <BeatLoader color={"#fff"} size={10} />
            ) : editingEvents ? (
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
