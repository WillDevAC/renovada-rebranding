import styled from "styled-components";

import { border_rounded, secondary } from "../../styles/variables";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-width: 25rem;
  background-color: ${secondary};
  border-radius: ${border_rounded};
`;


export const AuthLogo = styled.img `
  max-width: 18rem;
`;

export const AuthForm = styled.form `
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  width: 100%;
`