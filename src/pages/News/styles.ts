import styled from 'styled-components';

export const ActionsNews = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Actions = styled.div `
    display: flex;
    width: 10rem;
`;

export const NewsWrapper = styled.section `
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
