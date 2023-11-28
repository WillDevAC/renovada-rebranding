import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import { useAuthStore } from "../../stores/auth.store";
import { Navigate } from "react-router-dom";

import { Globe, House, Quotes, SignOut, Ticket, Article  } from "@phosphor-icons/react";

export const Sidebar = () => {
  const navigate = useNavigate();
   const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    return <Navigate to="/" />;
  };

  return (
    <>
      <S.LogoWrapper>
        <S.Logo src="logo.png" alt="Website Logo" />
      </S.LogoWrapper>
      <S.WrapperOptions>
        <S.Option onClick={() => navigate("/dashboard")}>
          <House size={25} />
          <S.OptionTitle>Dashboard</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/words")}>
          <Quotes size={25} />
          <S.OptionTitle>Palavras</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/cells")}>
          <Globe size={25} />
          <S.OptionTitle>Células</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/events")}>
          <Ticket size={25} />
          <S.OptionTitle>Eventos</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => navigate("/news")}>
          <Article  size={25} />
          <S.OptionTitle>Noticias</S.OptionTitle>
        </S.Option>
        <S.Option onClick={() => handleLogout()}>
          <SignOut size={25} />
          <S.OptionTitle>Desconectar</S.OptionTitle>
        </S.Option>
      </S.WrapperOptions>
    </>
  );
};
