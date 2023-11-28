import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "../../components/Button";
import { EventCard } from "../../components/Cards/Event";
import { Layout } from "../../components/Layout";
import { useQueryClient } from 'react-query';
import { useForm, SubmitHandler } from "react-hook-form";

import * as S from "./styles";
import api from "../../services/api";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";
import {Modal} from "../../components/Modal";
import {toast} from "react-toastify";

interface FormData {
    title: string;
    content: string;
    videoUrl: string;
    imgId: string;
    labelDate: string,
    address: string,
    date: string,
    price: number,
    isRequiredSubscription: boolean,
    maxRegistered: number,
    isHighlighted: boolean,
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
    labelDate: string,
    address: string,
    date: string,
    price: number,
    isRequiredSubscription: boolean,
    maxRegistered: number,
    isHighlighted: boolean,
    createdAt: string;
    updatedAt: string;
}

export const EventsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            data.imgId = null;
            data.isRequiredSubscription = data.isRequiredSubscription === "true";
            data.isHighlighted = data.isHighlighted === "true";
            data.price = parseFloat(data.price); // Convert to numeric value
            data.maxRegistered = parseFloat(data.maxRegistered); // Convert to numeric value

            console.log(data);
            await api.post("/event", data);
            await queryClient.refetchQueries("getEventList");
            setIsModalOpen(false);
            toast.success("Evento Cadastrado");
        } catch (error) {
            toast.error("Erro ao cadastrar evento:" + error);
        }
    };

    const GET_EVENTS_LIST = async () => {
        const response = await api.get(`/event`);
        console.log(response);
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
          <Button variant="default" onClick={() => setIsModalOpen(true)}>Cadastrar evento</Button>
        </S.Actions>
      </S.ActionsEvents>
      <S.EventsWrapper>
        {isLoading}

        {!isLoading && data.length < 0 && (
          <span>Não há eventos cadastrados.</span>
        )}

          {!isLoading ? (
              data.length > 0 ? (
                  data.map((event: EventsData) => (
                      <EventCard
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
                  ))
              ) : (
                  <span>Não há eventos cadastrados.</span>
              )
          ) : (
              <span>Carregando eventos...</span>
          )}
      </S.EventsWrapper>

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
                        name="labelDate"
                        {...register("labelDate", { required: "Este campo é obrigatório" })}
                    />
                    {errors.labelDate && (
                        <S.ErrorMessage>{errors.labelDate.message}</S.ErrorMessage>
                    )}
                </label>

                <label>
                    Endereço:
                    <Input
                        type="text"
                        name="address"
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
                        name="date"
                        {...register("date", { required: "Este campo é obrigatório" })}
                    />
                    {errors.date && (
                        <S.ErrorMessage>{errors.date.message}</S.ErrorMessage>
                    )}
                </label>

                <label>
                    É Necessário se Inscrever para Participar:
                    <Select
                        {...register("isRequiredSubscription", { required: "Este campo é obrigatório" })}
                        options={[
                            { value: true, label: "Sim" },
                            { value: false, label: "Não" },
                        ]}
                    />
                    {errors.isRequiredSubscription && (
                        <S.ErrorMessage>{errors.isRequiredSubscription.message}</S.ErrorMessage>
                    )}
                </label>

                <label>
                    Máximo de Participantes:
                    <Input
                        type="number"
                        name="maxRegistered"
                        {...register("maxRegistered", { required: "Este campo é obrigatório" })}
                    />
                    {errors.maxRegistered && (
                        <S.ErrorMessage>{errors.maxRegistered.message}</S.ErrorMessage>
                    )}
                </label>

                <label>
                    Preço (Se houver):
                    <Input
                        type="number"
                        name="price"
                        {...register("price", { required: "Este campo é obrigatório" })}
                    />
                    {errors.price && (
                        <S.ErrorMessage>{errors.price.message}</S.ErrorMessage>
                    )}
                </label>

                <label>
                    Evento em Destaque:
                    <Select
                        {...register("isHighlighted", { required: "Este campo é obrigatório" })}
                        options={[
                            { value: true, label: "Sim" },
                            { value: false, label: "Não" },
                        ]}
                    />
                    {errors.isHighlighted && (
                        <S.ErrorMessage>{errors.isRequiredSubscription.message}</S.ErrorMessage>
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
