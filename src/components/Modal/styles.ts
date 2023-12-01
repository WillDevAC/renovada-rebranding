import styled from 'styled-components';
import { background } from '../../styles/variables';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

export const ModalContent = styled.div`
  background: ${background};
  border: 1px solid #4b5563;
  padding: 20px;
  max-width: 100%;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  height: 90%;
  overflow: auto; 

  @media (min-width: 768px) {

    padding: 50px;
  }
`;

export const CloseButton = styled.button`
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
