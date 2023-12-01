import { Modal } from "../../Modal";
import { useEffect, useState } from "react";
import { Button } from "../../Button";
import api from "../../../services/api.ts";

import * as S from "./styles";
import formatDate from "../../../utils";
import { toast } from "react-toastify";


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
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubscribe = async (EventId: number) => {
    try {
      if (selectedUserId) {
        await api.post(`/event/add-subscriber/${selectedUserId}/${EventId}`);

        setSelectedUserId(null);

        toast.success("Participante adicionado com sucesso");
      } else {
        toast.error("Participante não selecionado");
      }
    } catch (error) {
      toast.error("Não foi possível adicionar participante" + error);
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
          <p>Criado em: {formatDate(createdAt)}</p>
          <p>Atualizado em: {formatDate(updatedAt)}</p>
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

          {Array.isArray(subscribers) ? (
            // Render the list of subscribers if it's an array
            subscribers.map((subscriber: any) => (
              <div key={subscriber.id} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-whit truncate dark:text-white">
                  {subscriber.user.name}
                </p>
                <p className="text-sm text-whit truncate dark:text-gray-400">
                  {subscriber.user.email}
                </p>
              </div>
            ))
          ) : (
            <h3>Nenhum participante cadastrado para esse evento</h3>
          )}

          <select
            name="selectedUserId"
            onChange={(e) => setSelectedUserId(e.target.value)}
            value={selectedUserId || ""}
            required
          >
            <option value="" disabled hidden>
              Escolha um participante
            </option>
            {usersAll?.map((user: Users) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => handleSubscribe(Number(id))}>
            Inscrever Participante
          </button>
        </Modal>
      </S.CardEvent>
    </>
  );
};
