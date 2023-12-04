import {Modal} from "../../Modal";
import React, {useEffect, useState} from "react";
import {Button} from "../../Button";
import formatDate from "../../../utils";

import {BeatLoader} from "react-spinners";

import * as S from "./styles";
import api from "../../../services/api.ts";
import {toast} from "react-toastify";
import Input from "../../Input";
import TextArea from "../../TextArea";
import {SubmitHandler, useForm} from "react-hook-form";
import Select from "../../Select";

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

interface FormData {
    groupId: string;
    amount: number;
    dateLabel: string,
    address: string;
    obs: string;
}

interface ReportsData {
    groupId: string;
    amount: number;
    dateLabel: string,
    address: string;
    obs: string;
    createdAt: string;
    updatedAt: string;
}

interface PresenceFormData {
    dateLabel: string;
    userId: string;
    groupId: string;
    isAcceptedJesus: boolean;
    isVisitor: boolean;
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
    // Modal do Form de criar relatorio
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [isModalPresenceOpen, setIsModalPresenceOpen] = useState<boolean>(false);

    const [editingReports, setEditingReports] = useState<ReportsData | null>(null);

    const [deleteClicked, setDeleteClicked] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [usersAll, setUsers] = useState<Users[]>([]);

    const [presences, setPresences] = useState([]);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = useForm<FormData>();

    const {
        register: registerPresence,
        handleSubmit: handleSubmitPresence,
        formState: { errors: presenceErrors },
        reset: resetPresence,
        setValue: setPresenceValue,
    } = useForm<PresenceFormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const formData = new FormData();

            const reportsData = {
                ...data,

            };

            reportsData.amount = parseFloat(data.amount.toString()) || 0;

            console.log(reportsData);
            if (editingReports) {
                await api.put(`/group/${editingReports.id}`, reportsData);
            } else {
                await api.post("/group/add-report", reportsData);
            }

            setIsModalOpen(false);
            toast.success(
                editingReports
                    ? "Relatório editado com sucesso!"
                    : "Relatório cadastrado com sucesso!"
            );
            reset();

            reset();
        } catch (error) {
            toast.error("Erro ao cadastrar/editar Relatório: " + error);
        } finally {
            queryClient.invalidateQueries("getCellsList");
        }
    };

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

    const fetchPresences = async () => {
        try {
            console.log(id);
            const response = await api.get(`/group/list-presence?groupId=${id}`);
            console.log(response)
            setPresences(response.data.presences);
        } catch (error) {
            console.error("Error fetching presences:", error);
        }
    };

    const handleModalOpen = () => {
        setModalOpen(true);
        fetchPresences();
    };

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

    const onAddPresence: SubmitHandler<PresenceFormData> = async (data) => {
        try {
            const presenceData = {
                ...data,
                userId: selectedUserId,
                isAcceptedJesus: Boolean(data.isAcceptedJesus),
                isVisitor: Boolean(data.isVisitor),
            };

            console.log(presenceData);

            await api.post("/group/add-presence", presenceData);

            setIsModalOpen(false);
            toast.success("Presença adicionada com sucesso!");
            resetPresence();
        } catch (error) {
            toast.error("Erro ao adicionar presença: " + error);
        } finally {
            // You may want to invalidate some queries here if needed
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
                    <Button variant="view" onClick={() => handleModalOpen()}>
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
                        <Button variant="default" onClick={() => setIsModalOpen(true)}>
                            Cadastrar Relatório
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
                    <Button variant="default" onClick={() => setIsModalPresenceOpen(true)}>
                        Adicionar Presenca
                    </Button>

                    <h2>Presenças</h2>
                    {presences.length > 0 ? (
                        <ul>
                            {presences.map((presence) => (
                                <li key={presence.id}>
                                    <span>{presence.user.name}</span>
                                    <span>Data: {presence.dateLabel}</span>
                                    <span>Aceitou Jesus: {presence.isAcceptedJesus ? 'Sim' : 'Não'}</span>
                                    <span>Visitante: {presence.isVisitor ? 'Sim' : 'Não'}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhuma presença registrada ainda.</p>
                    )}
                </Modal>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2>Cadastrar/editar Relatório</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            type="hidden"
                            value={id}
                            {...register("groupId", {
                                required: "Este campo é obrigatório",
                            })}
                        />
                        <input type="hidden" name="groupId" value={id}/>
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
                            Endereço:
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
                            Quantidade de Participantes:
                            <Input
                                type="number"
                                {...register("amount", {
                                    required: "Este campo é obrigatório",
                                })}
                            />
                            {errors.amount && (
                                <S.ErrorMessage>{errors.amount.message}</S.ErrorMessage>
                            )}
                        </label>

                        <label>
                            Descrição do relatório:
                            <TextArea
                                rows={4}
                                cols={50}
                                {...register("obs", {
                                    required: "Este campo é obrigatório",
                                })}
                            />
                            {errors.obs && (
                                <S.ErrorMessage>{errors.obs.message}</S.ErrorMessage>
                            )}
                        </label>

                        <Button type="submit" variant="edit">
                            {loading ? (
                                <BeatLoader color={"#fff"} size={10}/>
                            ) : editingReports ? (
                                "Editar"
                            ) : (
                                "Cadastrar"
                            )}
                        </Button>
                    </form>
                </Modal>

                <Modal isOpen={isModalPresenceOpen} onClose={() => setIsModalPresenceOpen(false)}>
                    {/* ... (other JSX code) */}

                    {/* Add Presence Form */}
                    <h2>Adicionar Presença</h2>

                    <form onSubmit={handleSubmitPresence(onAddPresence)}>
                        <Input
                            type="hidden"
                            value={id}
                            {...registerPresence("groupId", {
                                required: "Este campo é obrigatório",
                            })}
                        />
                        <label>
                            Data e Hora:
                            <Input
                                {...registerPresence("dateLabel", {
                                    required: "Este campo é obrigatório",
                                })}
                            />
                            {presenceErrors.dateLabel && (
                                <S.ErrorMessage>{presenceErrors.dateLabel.message}</S.ErrorMessage>
                            )}
                        </label>

                        <label>
                            Participante:
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
                            {presenceErrors.userId && (
                                <S.ErrorMessage>{presenceErrors.userId.message}</S.ErrorMessage>
                            )}
                        </label>

                        <label>
                            Aceitou Jesus:
                            <Select
                                {...registerPresence("isAcceptedJesus", {
                                    required: "Este campo é obrigatório",
                                })}
                                options={[
                                    { value: true, label: "Sim" },
                                    { value: false, label: "Não" },
                                ]}
                            />
                            {errors.isAcceptedJesus && errors.isAcceptedJesus.message && (
                                <S.ErrorMessage>{errors.isAcceptedJesus.message}</S.ErrorMessage>
                            )}
                        </label>

                        <label>
                            É Visitante:
                            <Select
                                {...registerPresence("isVisitor", {
                                    required: "Este campo é obrigatório",
                                })}
                                options={[
                                    { value: true, label: "Sim" },
                                    { value: false, label: "Não" },
                                ]}
                            />
                            {errors.isVisitor && errors.isVisitor.message && (
                                <S.ErrorMessage>{errors.isVisitor.message}</S.ErrorMessage>
                            )}
                        </label>

                        <Button type="submit" variant="edit">
                            Adicionar Presença
                        </Button>
                    </form>
                </Modal>
            </S.CardEvent>
        </>
    );
};
