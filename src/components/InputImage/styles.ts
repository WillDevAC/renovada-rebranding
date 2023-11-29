
import styled from "styled-components";

// Importe as variáveis de estilo
import { border_rounded, input_background } from "../../styles/variables";


export const ImageInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;


export const ImageInputLabel = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

export const StyledImageInput = styled.input`
  display: none; 
`;

export const ImageSelectButton = styled.label`
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #FFF;
  border-radius: ${border_rounded};
  background-color: ${input_background};
  cursor: pointer;
  display: inline-block;
`;

export const SelectedImage = styled.img`
  width: 10%;  
  max-width: 10%;  
  margin-top: 0.5rem;
`;
