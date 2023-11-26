import React from "react";

interface ILayoutProps {
  children: React.ReactNode;
}

import * as S from "./styles";

import { Sidebar } from "../Sidebar";

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <S.Wrapper>
      <S.Aside>
        <Sidebar />
      </S.Aside>
      <S.Main>
        { children }
      </S.Main>
    </S.Wrapper>
  );
};
