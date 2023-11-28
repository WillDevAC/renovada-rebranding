import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { Button } from "../../components/Button";
import Input from "../../components/Input";

import api from "../../services/api";

import * as S from "./styles";

export const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.info("Preencha os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      authStore.setToken(response.data.token);
      authStore.setUser(response.data.user);

      setLoading(false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setLoading(false);
      toast.error("Senha ou usuário incorreto.");
    }
  };

  return (
    <S.Container>
      <S.Wrapper>
        <S.AuthLogo src="logo.png" alt="Website Logo" />
        <S.AuthForm>
          <Input
            type="text"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="button" onClick={handleLogin} variant="default">
            {loading && <BeatLoader color={"#FFF"} size={10} />}
            {!loading && "Entrar"}
          </Button>
        </S.AuthForm>
      </S.Wrapper>
    </S.Container>
  );
};
