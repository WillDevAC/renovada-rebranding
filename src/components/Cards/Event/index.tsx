import {Modal} from "../../Modal";
import {useEffect, useState} from "react";
import {Button} from "../../Button";
import api from "../../../services/api.ts";
import YouTube from "react-youtube";

import * as S from "./styles";
import formatDate from "../../../utils";
import {toast} from "react-toastify";

interface IEventCard {
    image: string | null;
    title: string;
    date: string;
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    videoUrl: string;
}

export const EventCard = ({
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
                              onDelete
                          }: IEventCard) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [usersAll, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const youtubeOpts = {
        height: "515",
        width: "99%",
        playerVars: {
            autoplay: 0,
        },
    };

    useEffect(() => {
        // Fetch the list of users when the component mounts
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

    const handleSubscribe = async (EventId) => {
        try {
            console.log(selectedUserId);
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
                    <S.CardImage src={image} alt="Image Event"/>
                </S.CardEventImageWrapper>
                <S.CardEventDetails>
                    <h1>{title}</h1>
                    <span>{labelDate}</span>
                </S.CardEventDetails>

                <S.CardEventActions>
                    <Button variant="view" onClick={() => setModalOpen(true)}>
                        Visualizar
                    </Button>
                    <Button variant="edit">Editar</Button>
                    <Button variant="delete" onClick={() => onDelete(id)}>Excluir</Button>
                </S.CardEventActions>
            </S.CardEvent>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h1>{title}</h1>
                {subscribers.map(subscriber => (

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-whit truncate dark:text-white">
                            {subscriber.user.name}
                        </p>
                        <p className="text-sm text-whit truncate dark:text-gray-400">
                            {subscriber.user.email}
                        </p>
                    </div>

                ))}

                <p>{content}</p>
                <p>Criado em: {formatDate(createdAt)}</p>
                <p>Atualizado em: {formatDate(updatedAt)}</p>
                {videoUrl && (
                    <YouTube
                        videoId="https://www.youtube.com/watch?v=zzyJrvHRBdo"
                        opts={youtubeOpts}
                    />
                )}
                <p>{labelDate}</p>

                {subscribers.length === 0 && (
                    <h3>Nenhum participante cadastrado para esse
                        evento</h3>
                )}

                <select
                    name="selectedUserId"
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    value={selectedUserId || ""}
                    required>
                    <option value="" disabled hidden>Escolha um participante</option>
                    {usersAll.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} - {user.email}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => handleSubscribe(id)}
                >
                    Inscrever Participante
                </button>
            </Modal>
        </>
    );
};
