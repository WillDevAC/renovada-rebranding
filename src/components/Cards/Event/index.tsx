import { Modal } from "../../Modal";
import { useEffect, useState } from "react";
import { Button } from "../../Button";
import api from "../../../services/api.ts";

import * as S from "./styles";
import { toast } from "react-toastify";
import styled from "styled-components";
import {Trash} from "@phosphor-icons/react";

interface IEventCard {
  image: string | null;
  title: string;
  date: string;
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  videoUrl: string;
  onEdit: (eventData: any) => void;
  onDelete: (id: string) => void;
  address: string;
  isRequiredSubscription: boolean;
  maxRegistered: number;

  isHighlighted: boolean;
  price: string;
  labelDate: string;
  SubscribersEvent: null | any;
  subscribers: any;
}

interface Users {
  id: string;
  name: string;
  email: string;
}

const SubscribersList = styled.div`
  background: #616161;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 5px;
`;

export const EventCard: React.FC<IEventCard> = ({
  id,
  image,
  content,
  labelDate,
  videoUrl,
  subscribers,
  createdAt,
  updatedAt,
  title,
  date,
  onEdit,
  onDelete,
  address,
  SubscribersEvent,
  isRequiredSubscription,
  maxRegistered,

  isHighlighted,
  price,
}: IEventCard) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [usersAll, setUsers] = useState<Users[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user");
        setUsers(response.data.users);
      } catch (error) {
        let errorMessage = "Erro ao buscar eventos";

        if (error.response && error.response.data && error.response.data.message) {
          errorMessage += `: ${error.response.data.message}`;
        }

        toast.error(errorMessage);
      }
    };

    fetchUsers();
  }, []);

  const handleSubscribe = async (EventId: string) => {
    try {
      if (selectedUserId) {
        await api.post(`/event/add-subscriber-with-cash-pay/${selectedUserId}/${EventId}`);

        setSelectedUserId(null);

        toast.success("Participante adicionado com sucesso");
      } else {
        toast.error("Participante não selecionado");
      }
    } catch (error) {
      let errorMessage = "Não foi possível adicionar participante";

      if (error.response && error.response.data && error.response.data.message) {
        errorMessage += `: ${error.response.data.message}`;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <S.CardEvent>
        <S.CardEventImageWrapper>
          {image && <S.CardImage src={image} alt="Image Event" />}
        </S.CardEventImageWrapper>
        <S.CardEventDetails>
          <h1>{title}</h1>
          <span>{labelDate}</span>
        </S.CardEventDetails>

        <S.CardEventActions>
          <Button variant="view" onClick={() => setModalOpen(true)}>
            Visualizar
          </Button>
          <Button
            variant="edit"
            onClick={() =>
              onEdit({
                id,
                img: { url: image || "" },
                title,
                content,
                videoUrl,
                labelDate,
                address,
                date,
                createdAt,
                updatedAt,
                isRequiredSubscription,
                maxRegistered,
                SubscribersEvent,
                isHighlighted,
                price,
                subscribers,
                imgId: "",
              })
            }
          >
            Editar
          </Button>
          <Button variant="delete" onClick={() => onDelete(id)}>
            Excluir
          </Button>
        </S.CardEventActions>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h1>{title}</h1>

          <p>{content}</p>
          {videoUrl && (
            <S.CardVideo>
              <iframe
                title="Selected Video"
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoUrl.split("v=")[1]}`}
                allowFullScreen
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </S.CardVideo>
          )}
          <p>{labelDate}</p>

            <h2>Lista de inscritos do Evento:</h2>
            <S.AddParticipant>
              <S.ModalSelect
                  name="selectedUserId"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  value={selectedUserId || ""}
                  required
              >
                <option value="" disabled hidden>
                  Escolha um participante
                </option>
                {usersAll?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </option>
                ))}
              </S.ModalSelect>
              <S.ModalButtons>
                <S.ModalButton
                    type="button"
                    onClick={() => handleSubscribe(String(id))}
                >
                  Inscrever Participante
                </S.ModalButton>
              </S.ModalButtons>
            </S.AddParticipant>
            <S.Table>
              <tbody>
              {Array.isArray(SubscribersEvent) &&
              SubscribersEvent.length > 0 ? (
                  SubscribersEvent.map((subscriber: any) => (
                      <tr key={subscriber.user.id}>
                        <td>{subscriber.user.name}</td>
                        <td>{subscriber.user.email}</td>
                      </tr>
                  ))
              ) : (
                  <h3>
                    Nenhum participante cadastrado para esse grupo
                  </h3>
              )}
              </tbody>
            </S.Table>
        </Modal>
      </S.CardEvent>
    </>
  );
};
