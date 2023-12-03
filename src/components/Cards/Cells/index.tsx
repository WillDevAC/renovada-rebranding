import {Modal} from "../../Modal";
import {useState} from "react";
import {Button} from "../../Button";
import formatDate from "../../../utils";

import {BeatLoader} from "react-spinners";

import * as S from "./styles";

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

    const handleDelete = () => {
        setDeleteClicked(true);
        onDelete(id);
        setModalOpen(false);
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
                </Modal>
            </S.CardEvent>
        </>
    );
};
