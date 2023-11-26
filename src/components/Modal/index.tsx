import React from "react";

import * as S from "./styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    isOpen && (
      <S.ModalOverlay className="modal-overlay" onClick={onClose}>
        <S.ModalContent
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </S.ModalContent>
      </S.ModalOverlay>
    )
  );
};
