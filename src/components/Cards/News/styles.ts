import styled from "styled-components";

import { border_rounded, secondary } from "../../../styles/variables";

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
