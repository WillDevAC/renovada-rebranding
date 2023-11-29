import { Modal } from "../../Modal";
import { useState } from "react";
import { Button } from "../../Button";
import formatDate from "../../../utils";
import YouTube from "react-youtube";
import { BeatLoader } from "react-spinners";

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
  shortDescription: string;
  onDelete: (id: string) => void;
  onEdit: (event: any) => void;
  loading: boolean;
}

export const NewsCard = ({
  image,
  title,
  date,
  id,
  shortDescription,
  content,
  createdAt,
  updatedAt,
  videoUrl,
  loading,
  onDelete,
  onEdit,
}: IEventCard) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const youtubeOpts = {
    height: "515",
    width: "99%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleDelete = () => {
    setDeleteClicked(true);
    onDelete(id);
    setModalOpen(false);
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

          <Button
            variant="edit"
            onClick={() =>
              onEdit({ id, title, content, videoUrl, shortDescription })
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
              <BeatLoader color={"#FFF"} size={10} />
            )}
            {!loading && !deleteClicked && "Excluir"}
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
        </Modal>
      </S.CardEvent>
    </>
  );
};
