import styled from 'styled-components';
import { border_rounded, input_background } from "../../styles/variables";

export const ActionsUsers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Actions = styled.div `
    display: flex;
    width: 10rem;
`;

export const UsersWrapper = styled.section `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 2rem;
    grid-gap: 1rem;
`;
export const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  display: block;
  margin-top: -4px;

`;
export const InputImage = styled.input`
display: flex;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #FFF;
  border-radius: ${border_rounded};
  background-color: ${input_background};
   width: 100%;
   margin-bottom: 20px;
`;