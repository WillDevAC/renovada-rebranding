import {Modal} from "../../Modal";
import {useEffect, useState} from "react";
import {Button} from "../../Button";
import formatDate from "../../../utils";

import {BeatLoader} from "react-spinners";

import * as S from "./styles";
import api from "../../../services/api.ts";
import {toast} from "react-toastify";

interface IEventCard {
    image: string | null;
    name: string;
    id: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    dateLabel: string;
    // dateLabel: "DD/MM/YYYY";
    onDelete: (id: string) => void;
    onEdit: (event: any) => void;
    loading: boolean;
}

interface Users {
    id: string;
    name: string;
    email: string;
}

export const CellsCard = ({
                              image,
                              name,
                              dateLabel,
                              id,
                              address,
                              createdAt,
                              updatedAt,
                              loading,
                              onDelete,
                              onEdit,
                          }: IEventCard) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteClicked, setDeleteClicked] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [usersAll, setUsers] = useState<Users[]>([]);

    const handleDelete = () => {
        setDeleteClicked(true);
        onDelete(id);
        setModalOpen(false);
    };

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

    const handleSubscribe = async (CellId: String) => {
        try {
            console.log(CellId)
            if (selectedUserId) {
                await api.put(`/group/add-member/${CellId}/${selectedUserId}`);

                setSelectedUserId(null);

                toast.success("Participante adicionado com sucesso");
            } else {
                toast.error("Participante não selecionado");
            }
        } catch (error) {
            toast.error("Não foi possível adicionar participante" + error);
        }
    };

    const handleRemoveMember = async (groupId: string) => {
        try {
            if(selectedUserId) {
                await api.put(`/group/remove-member/${groupId}/${selectedUserId}`);
                toast.success("Participante removido com sucesso");
            }else {
                toast.error("Participante não selecionado");
            }
        } catch (error) {
            toast.error("Não foi possível remover o participante" + error);
        }
    };

    return (
        <>
            <S.CardEvent>
                <S.CardEventImageWrapper>
                    {image && <S.CardImage src={image} alt="Image Event"/>}
                </S.CardEventImageWrapper>
                <S.CardEventDetails>
                    <h1>{name}</h1>
                    <span>{dateLabel}</span>
                    <span>{address}</span>
                </S.CardEventDetails>
                <S.CardEventActions>
                    <Button variant="view" onClick={() => setModalOpen(true)}>
                        Visualizar
                    </Button>

                    <Button
                        variant="edit"
                        onClick={() =>
                            onEdit({id, name, dateLabel, address})
                        }
                    >
                        Editar
                    </Button>
                    <Button
                        variant="delete"
                        onClick={handleDelete}
                        disabled={deleteClicked}
                    >
                        {loading && deleteClicked && (
                            <BeatLoader color={"#FFF"} size={10}/>
                        )}
                        {!loading && !deleteClicked && "Excluir"}
                    </Button>
                </S.CardEventActions>
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <h1>{name}</h1>
                    <p>{dateLabel}</p>
                    <span>{address}</span>
                    <p>Criado em: {formatDate(createdAt)}</p>
                    <p>Atualizado em: {formatDate(updatedAt)}</p>
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
                    <button type="button" onClick={() => handleSubscribe(String(id))}>
                        Inscrever Participante
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRemoveMember(String(id))}
                    >
                        Remover Participante
                    </button>
                </Modal>
            </S.CardEvent>
        </>
    );
};
