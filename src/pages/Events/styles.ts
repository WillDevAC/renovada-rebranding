import styled from 'styled-components';
import { border_rounded, secondary } from '../../styles/variables';

export const ActionsEvents = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Actions = styled.div `
    display: flex;
    width: 10rem;
`;

export const EventsWrapper = styled.section `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 2rem;
    grid-gap: 1rem;
`;