import { Modal } from "../../Modal";
import { useState } from "react";
import { Button } from "../../Button";

import { BeatLoader } from "react-spinners";

import * as S from "./styles";

interface IEventCard {
  image: string | null;
  title: string;
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  videoUrl: string;
  onDelete: (id: string) => void;
  onEdit: (event: any) => void;
  loading: boolean;
  author: string;
  type: string;
  categoryId: string;
}

export const WordsCard = ({
  image,
  title,
  id,
  content,
  videoUrl,
  loading,
  author,
  type,
  categoryId,
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
          {image && <S.CardImage src={image} alt="Image Event" />}
        </S.CardEventImageWrapper>
        <S.CardEventDetails>
          <h1>{title}</h1>
        </S.CardEventDetails>
        <S.CardEventActions>
          <Button variant="view" onClick={() => setModalOpen(true)}>
            Visualizar
          </Button>

          <Button
            variant="edit"
            onClick={() =>
              onEdit({ id, title, content, videoUrl, author, type, categoryId  })
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
          <p>Autoria: {author}</p>
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
