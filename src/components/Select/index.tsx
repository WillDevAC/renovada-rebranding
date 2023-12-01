// components/Select/index.tsx
import React, { forwardRef, SelectHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import styled from "styled-components";

import { border_rounded, input_background } from "../../styles/variables";

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const StyledSelect = styled.select`
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid rgb(40, 39, 44);
  color: #fff;
  border-radius: ${border_rounded};
  background-color: ${input_background};
`;
interface Option {
  value: boolean;
  label: string;
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  register?: UseFormRegister<any>;
  options: Option[];
}

const Select: React.ForwardRefRenderFunction<
  HTMLSelectElement,
  ISelectProps
> = ({ label, register, options, ...rest }, ref) => {
  return (
    <SelectWrapper>
      {label && <Label>{label}</Label>}
      <StyledSelect ref={ref} {...register} {...rest}>
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
};

export default forwardRef(Select);