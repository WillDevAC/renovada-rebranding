import styled from "styled-components";

import { border_rounded, secondary, input_background } from "../../../styles/variables";

export const CardEvent = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  background-color: ${secondary};
  border-radius: ${border_rounded};
`;

export const CardEventImageWrapper = styled.div`
  display: flex;
  height: 13rem;
  width: 100%;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const CardEventDetails = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1rem;
`;

export const CardEventActions = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
`;
export const CardVideo = styled.div`
  width: 100%;
  height: 80% !important;
  display: flex;
  justify-content: center;

  iframe {
    width: 60%;
    height: 90%;
  }
`;
export const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  display: block;
  margin-top: -4px;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${secondary};
  border-radius: ${border_rounded};
  padding: 1rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 1rem;
  }
`;

export const ModalMembersList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 1rem;

    p {
      margin-bottom: 0.5rem;
    }
  }
`;

export const ModalSelect = styled.select`
 outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #fff;
  border-radius: ${border_rounded};
  background-color: ${input_background};
  margin-bottom: 1rem;
  width: 70%;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ModalReportsList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    border: 1px solid #ddd; 
    border-radius: ${border_rounded};
    background-color: #333; 
    color: #ddd;

    p {
      margin-bottom: 0.5rem;
      color: #fff; 
    }

    &:last-child {
      margin-bottom: 0; 
    }
  }
`;

export const AddParticipant = styled.div`
  display: flex;
  gap: 10px;
`;

export const ModalButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border-bottom: 1px solid #ddd;
     border-top: 1px solid #ddd;
    padding: 8px;
    text-align: left;
   
  }



  td:last-child {
    text-align: center;
    
  }
`;
export const InputDate = styled.input`
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #FFF;
  border-radius: ${border_rounded};
  background-color: ${input_background};
  width: 100%;
`