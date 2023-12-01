import styled from 'styled-components';
import { border_rounded, input_background } from '../../styles/variables';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

export const StyledInput = styled.input`
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #FFF;
  border-radius: ${border_rounded};
  background-color: ${input_background};
  width: 100%;

  @media (min-width: 768px) {
    /* Estilos adicionais para telas maiores, se necessário */
  }
`;