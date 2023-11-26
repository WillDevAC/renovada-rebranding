import React, { InputHTMLAttributes } from "react";

import * as S from "./styles";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<IInputProps> = ({ label, ...rest }) => {
  return (
    <S.InputWrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.StyledInput {...rest} />
    </S.InputWrapper>
  );
};