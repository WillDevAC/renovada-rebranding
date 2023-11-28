// components/Input/index.tsx
import React, { forwardRef, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import * as S from "./styles";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: UseFormRegister<any>;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  { label, register, ...rest },
  ref
) => {
  return (
    <S.InputWrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.StyledInput ref={ref} {...register} {...rest} />
    </S.InputWrapper>
  );
};

export default forwardRef(Input);
