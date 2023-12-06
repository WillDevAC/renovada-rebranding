// eslint-disable-line react-hooks/exhaustive-deps
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Modal } from "../../Modal";
import { useEffect, useState } from "react";
import { Button } from "../../Button";
import formatDate from "../../../utils";

import { BeatLoader } from "react-spinners";

import * as S from "./styles";
import api from "../../../services/api.ts";
import { toast } from "react-toastify";
import Input from "../../Input";
import TextArea from "../../TextArea";
import { SubmitHandler, useForm } from "react-hook-form";
import { QueryClient } from "react-query";
import { Tabs, Tab } from "@mui/material";
import Loading from "../../loading/index.tsx";

import Select from "../../Select";

import { Trash } from "@phosphor-icons/react";
interface IEventCard {
  image: string | null;
  name: string;
  id: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  dateLabel: string;
  GroupMembers: null | any;
  onDelete: (id: string) => void;
  onEdit: (event: any) => void;
  GET_CELLS_LIST: () => void;
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
  dateLabel: string;
  address: string;
  obs: string;
  GroupMembers: null | any;
  isVisitor: boolean;
  isAcceptedJesus: boolean;
}

interface ReportsData {
  id: string;
  groupId: string;
  amount: string;
  dateLabel: string;
  address: string;
  obs: string;
  createdAt: string;
  updatedAt: string;
  qtdAcceptedJesus: number;
  qtdVisitor: number;
  qtdPresence: number;
  qtdMalePresence: number;
  qtdFemalePresence: number;
}

interface PresenceFormData {
  dateLabel: string;
  userId: string;
  groupId: string;
  isAcceptedJesus: boolean;
  isVisitor: boolean;
  id: string;
  member: {
    id: string;
    name: string;
    email: string;
  };
}
export const CellsCard = ({
  image,
  name,
  dateLabel,
  id,
  address,
  GET_CELLS_LIST,
  GroupMembers,
  createdAt,
  updatedAt,
  loading,
  onDelete,
  onEdit,
}: IEventCard) => {
  const [modalOpen, setModalOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [editingReports, setEditingReports] = useState<ReportsData | null>(
    null
  );
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [usersAll, setUsers] = useState<Users[]>([]);

  const [presences, setPresences] = useState<PresenceFormData[]>([]);
  const [reports, setReports] = useState<ReportsData[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [compLoading, setCompLoading] = useState<boolean>(true);

  const queryClient = new QueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  const {
    register: registerPresence,
    handleSubmit: handleSubmitPresence,
    formState: { errors: presenceErrors },
    reset: resetPresence,
  } = useForm<PresenceFormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setCompLoading(true);
      const reportsData = {
        ...data,
      };

      reportsData.amount = parseFloat(data.amount.toString()) || 0;

      if (editingReports) {
        await api.put(`/group/update-report/${editingReports.id}`, reportsData);
      } else {
        await api.post("/group/add-report", reportsData);
      }

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
      fetchReports();
      setCompLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteClicked(true);
    onDelete(id);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setCompLoading(true);
      const response = await api.get("/user");
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Error ao buscar usuários:" + error);
    } finally {
      setCompLoading(false);
    }
  };

  const fetchPresences = async () => {
    try {
      setCompLoading(true);
      const response = await api.get(`/group/list-precensa?groupId=${id}`);
      setPresences(response.data.presences);
    } catch (error) {
      toast.error("Error ao carregar as presenças:" + error);
    } finally {
      setCompLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setCompLoading(true);
      const response = await api.get(`/group/list-report?groupId=${id}`);
      setReports(response.data.data);
    } catch (error) {
      toast.error("Error fetching reports:" + error);
    } finally {
      setCompLoading(false);
    }
  };

  const handleEditReport = (report: ReportsData) => {
    setEditingReports(report);
    setValue("dateLabel", report.dateLabel);
    setValue("groupId", report.groupId);

    const amountValue = parseFloat(report.amount);
    setValue("amount", isNaN(amountValue) ? 0 : amountValue);

    setValue("address", report.address);
    setValue("obs", report.obs);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    fetchPresences();
    fetchReports();
  };

  const handleSubscribe = async (CellId: string) => {
    try {
      setCompLoading(true);
      if (selectedUserId) {
        await api.put(`/group/add-member/${CellId}/${selectedUserId}`);

        setSelectedUserId(null);

        toast.success("Participante adicionado com sucesso");
      } else {
        setCompLoading(false);
        toast.error("Participante não selecionado");
      }
    } catch (error) {
      toast.error("Não foi possível adicionar participante" + error);
    } finally {
      GET_CELLS_LIST();
      setCompLoading(false);
    }
  };

  const handleRemoveMember = async (groupId: string, memberId: string) => {
    try {
      setCompLoading(true);
      if (memberId) {
        await api.put(`/group/remove-member/${groupId}/${memberId}`);
        toast.success("Participante removido com sucesso");
      } else {
        toast.error("Participante não selecionado");
        setCompLoading(false);
      }
    } catch (error) {
      toast.error("Não foi possível remover o participante" + error);
    } finally {
      GET_CELLS_LIST();
      setCompLoading(false);
    }
  };

  const onAddPresence: SubmitHandler<PresenceFormData> = async (data) => {
    try {
      setCompLoading(true);
      const presenceData = {
        ...data,
        userId: selectedUserId,
        isAcceptedJesus: Boolean(data.isAcceptedJesus),
        isVisitor: Boolean(data.isVisitor),
      };

      await api.post("/group/add-presence", presenceData);

      toast.success("Presença adicionada com sucesso!");
      resetPresence();
    } catch (error) {
      toast.error("Erro ao adicionar presença: " + error);
    } finally {
      fetchPresences();
      setCompLoading(false);
    }
  };

  const handleDeletePresence = async (presenceId: string) => {
    try {
      setCompLoading(true);
      await api.put(`/group/remove-presence/${presenceId}`);
      toast.success("Presença removida com sucesso");

      fetchPresences();
    } catch (error) {
      toast.error("Não foi possível remover a Presença" + error);
    } finally {
      fetchPresences();
      setCompLoading(false);
    }
  };

  return (
    <>
      {compLoading ? (
        <Loading dark />
      ) : (
        <>
          <S.CardEvent>
            <S.CardEventImageWrapper>
              {image && <S.CardImage src={image} alt="Image Event" />}
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
                onClick={() => onEdit({ id, name, dateLabel, address })}
              >
                Editar
              </Button>
              <Button
                variant="delete"
                onClick={handleDelete}
                disabled={deleteClicked}
              >
                {loading && deleteClicked && (
                  <BeatLoader color={"#FFF"} size={10} />
                )}
                {!loading && !deleteClicked && "Excluir"}
              </Button>
            </S.CardEventActions>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
              <S.ModalContainer>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    label="Detalhes da célula"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  />
                  <Tab
                    label="Lista de Membros"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  />
                  <Tab
                    label="Relatórios"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  />
                  <Tab
                    label="Presenças"
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  />
                </Tabs>

                {activeTab === 0 && (
                  <S.ModalHeader>
                    <h1>{name}</h1>

                    <span>Local: {address}</span>
                    <p>Dia: {dateLabel}</p>
                    <p>Criado em: {formatDate(createdAt)}</p>
                    <p>Atualizado em: {formatDate(updatedAt)}</p>
                  </S.ModalHeader>
                )}
                {activeTab === 1 && (
                  <>
                    <h2>Lista de membros do Grupo:</h2>
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
                      <thead>
                        <tr>
                          <th>Membro</th>
                          <th>Email</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(GroupMembers) &&
                        GroupMembers.length > 0 ? (
                          GroupMembers.map((membro: any) => (
                            <tr key={membro.member.id}>
                              <td>{membro.member.name}</td>
                              <td>{membro.member.email}</td>
                              <td className="actions">
                                <Button
                                  variant="delete"
                                  onClick={() =>
                                    handleRemoveMember(id, membro.member.id)
                                  }
                                >
                                  <Trash size={32} />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <h3>
                            Nenhum participante cadastrado para esse grupo
                          </h3>
                        )}
                      </tbody>
                    </S.Table>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <h2>Relatórios</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        type="hidden"
                        value={id}
                        {...register("groupId", {
                          required: "Este campo é obrigatório",
                        })}
                      />
                      <input type="hidden" name="groupId" value={id} />
                      <label>
                        Data e Hora:
                        <Input
                          {...register("dateLabel", {
                            required: "Este campo é obrigatório",
                          })}
                        />
                        {errors.dateLabel && (
                          <S.ErrorMessage>
                            {errors.dateLabel.message}
                          </S.ErrorMessage>
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
                          <S.ErrorMessage>
                            {errors.address.message}
                          </S.ErrorMessage>
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
                          <S.ErrorMessage>
                            {errors.amount.message}
                          </S.ErrorMessage>
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
                          <BeatLoader color={"#fff"} size={10} />
                        ) : editingReports ? (
                          "Editar"
                        ) : (
                          "Cadastrar"
                        )}
                      </Button>
                    </form>
                    {reports.length > 0 ? (
                      <S.ModalReportsList>
                        {reports.map((report) => (
                          <li key={report.id}>
                            <p>Data: {report.dateLabel}</p>
                            <p>Endereço: {report.address}</p>
                            <p>
                              Quantidade de Pessoas Prevista: {report.amount}
                            </p>
                            <p>
                              Quantidade de Convertidos:{" "}
                              {report.qtdAcceptedJesus}
                            </p>
                            <p>
                              Quantidade de Mulheres Presentes:{" "}
                              {report.qtdFemalePresence}
                            </p>
                            <p>
                              Quantidade de Homens Presentes:{" "}
                              {report.qtdMalePresence}
                            </p>
                            <p>
                              Quantidade Total de Presentes:{" "}
                              {report.qtdPresence}
                            </p>
                            <p>Quantidade de Visitantes: {report.qtdVisitor}</p>
                            <Button
                              variant="edit"
                              onClick={() => handleEditReport(report)}
                            >
                              Editar
                            </Button>
                          </li>
                        ))}
                      </S.ModalReportsList>
                    ) : (
                      <p>Nenhum relatório registrado ainda.</p>
                    )}
                  </>
                )}
                {activeTab === 3 && (
                  <>
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
                          <S.ErrorMessage>
                            {presenceErrors.dateLabel.message}
                          </S.ErrorMessage>
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
                        {errors.isAcceptedJesus &&
                          errors.isAcceptedJesus.message && (
                            <S.ErrorMessage>
                              {errors.isAcceptedJesus.message}
                            </S.ErrorMessage>
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
                          <S.ErrorMessage>
                            {errors.isVisitor.message}
                          </S.ErrorMessage>
                        )}
                      </label>
                      <h3>Participante</h3>

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
                          {usersAll?.map((user: Users) => (
                            <option key={user.id} value={user.id}>
                              {user.name} - {user.email}
                            </option>
                          ))}
                        </S.ModalSelect>
                        {presenceErrors.userId && (
                          <S.ErrorMessage>
                            {presenceErrors.userId.message}
                          </S.ErrorMessage>
                        )}
                      </S.AddParticipant>
                      <Button type="submit" variant="edit">
                        Adicionar Presença
                      </Button>
                    </form>
                    <h2>Presenças</h2>

                    {presences.length > 0 ? (
                      <S.ModalReportsList>
                        {presences.map((presence) => (
                          <li key={presence.id}>
                            <p>{presence.member.name}</p>
                            <p>Data: {presence.dateLabel}</p>
                            <p>
                              Aceitou Jesus:{" "}
                              {presence.isAcceptedJesus ? "Sim" : "Não"}
                            </p>
                            <p>
                              Visitante: {presence.isVisitor ? "Sim" : "Não"}
                            </p>
                            <Button
                              variant="delete"
                              onClick={() => handleDeletePresence(presence.id)}
                            >
                              Excluir
                            </Button>
                          </li>
                        ))}
                      </S.ModalReportsList>
                    ) : (
                      <p>Nenhuma presença registrada ainda.</p>
                    )}
                  </>
                )}
              </S.ModalContainer>
            </Modal>
          </S.CardEvent>
        </>
      )}
    </>
  );
};
