// components/TextArea/index.tsx
import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import styled from "styled-components";

import { border_rounded, input_background } from "../../styles/variables";

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const StyledTextArea = styled.textarea`
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #fff;
  border-radius: ${border_rounded};
  background-color: ${input_background};
`;

interface ITextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  register?: UseFormRegister<any>;
}

const TextArea: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  ITextAreaProps
> = ({ label, register, ...rest }, ref) => {
  return (
    <TextAreaWrapper>
      {label && <Label>{label}</Label>}
      <StyledTextArea ref={ref} {...register} {...rest} />
    </TextAreaWrapper>
  );
};

export default forwardRef(TextArea);
