import { Modal } from "../../Modal";
import { useState } from "react";
import { Button } from "../../Button";
import formatDate from "../../../utils";
import YouTube from "react-youtube";

import * as S from "./styles";
import { toast } from "react-toastify";
import api from "../../../services/api";

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

export const NewsCard = ({
  image,
  title,
  date,
  id,
  content,
  createdAt,
  updatedAt,
  videoUrl,
}: IEventCard) => {
  const [modalOpen, setModalOpen] = useState(false);
  const youtubeOpts = {
    height: "515",
    width: "99%",
    playerVars: {
      autoplay: 0,
    },
  };
  const handleDelete = (id: string) => {
    try {
      const reponse = api.delete(`/news/${id}`);
    } catch (err) {
      toast.error("Ocorreu um erro ao deletar a noticia. Motivo" + err);
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
          <span>{date}</span>
        </S.CardEventDetails>
        <S.CardEventActions>
          <Button variant="view" onClick={() => setModalOpen(true)}>
            Visualizar
          </Button>
          <Button variant="edit">Editar</Button>
          <Button variant="delete" onClick={() => handleDelete(id)}>
            Deletar
          </Button>
        </S.CardEventActions>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h1>{title}</h1>
          <p>{content}</p>
          <p>Criado em: {formatDate(createdAt)}</p>
          <p>Atualizado em: {formatDate(updatedAt)}</p>
          {videoUrl && (
            <YouTube
              videoId="https://www.youtube.com/watch?v=zzyJrvHRBdo"
              opts={youtubeOpts}
            />
          )}
        </Modal>
      </S.CardEvent>
    </>
  );
};
