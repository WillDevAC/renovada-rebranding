import { useNavigate } from "react-router-dom";
import * as S from "./styles";

import { Globe, House, Quotes, SignOut, Ticket } from "@phosphor-icons/react";

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <>
      <S.LogoWrapper>
        <S.Logo src="logo.png" alt="Website Logo" />
      </S.LogoWrapper>
      <S.WrapperOptions>
        <S.Option onClick={() => navigate("/dashboard", { replace: true })}>
          <House size={25} />
          <S.OptionTitle>Dashboard</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/words", { replace: true })}>
          <Quotes size={25} />
          <S.OptionTitle>Palavras</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/cells", { replace: true })}>
          <Globe size={25} />
          <S.OptionTitle>Células</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/events", { replace: true })}>
          <Ticket size={25} />
          <S.OptionTitle>Eventos</S.OptionTitle>
        </S.Option>
        <S.Option>
          <SignOut size={25} />
          <S.OptionTitle>Desconectar</S.OptionTitle>
        </S.Option>
      </S.WrapperOptions>
    </>
  );
};
