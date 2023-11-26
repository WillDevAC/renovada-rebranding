import styled from "styled-components";

import { secondary } from "../../styles/variables";

export const Aside = styled.aside`
  background-color: ${secondary};
  height: 100vh;
  min-width: 18rem;
  padding: 1rem;
  position: sticky;
  top: 0;
`;

export const Main = styled.main`
  flex: 1;
  padding: 1rem;
`;

export const Wrapper = styled.div`
  display: flex;
`;
