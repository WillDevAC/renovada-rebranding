import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import GlobalStyle from "./styles/global.ts";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyle />
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer theme="dark" />
    </QueryClientProvider>
  </React.StrictMode>
);
