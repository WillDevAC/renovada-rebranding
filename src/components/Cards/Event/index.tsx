import { Modal } from "../../Modal";
import { useState } from "react";
import { Button } from "../../Button";

import * as S from "./styles";

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

export const EventCard = ({id, image, title, date, onDelete }: IEventCard) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <S.CardEvent>
        <S.CardEventImageWrapper>
          <S.CardImage src={image} alt="Image Event" />
        </S.CardEventImageWrapper>
        <S.CardEventDetails>
          <h1>{title}</h1>
          <span>{date}</span>
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
        <h2>Conteúdo do Modal 1</h2>
      </Modal>
    </>
  );
};
