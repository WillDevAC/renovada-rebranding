import { createGlobalStyle } from "styled-components";

import { background } from "./variables";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${background};
    font-family: 'Roboto', sans-serif;
    color: white;
    margin: 0;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
