import styled, { css } from "styled-components";

import { primary } from "../../styles/variables";

interface StyledButtonProps {
  variant?: "default" | "delete" | "accept" | "edit" | "view";
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 0.625rem 0.9375rem;
  font-size: 1rem;

  ${(props) =>
    props.variant === "view" &&
    css`
      border: 1px solid #4b5563;
      background-color: #1f2937;
      color: white;
    `}

  ${(props) =>
    props.variant === "default" &&
    css`
      background-color: ${primary};
      color: #ffffff;
    `}

  ${(props) =>
    props.variant === "delete" &&
    css`
      background-color: #dc3545;
      color: #ffffff;
    `}

  ${(props) =>
    props.variant === "accept" &&
    css`
      background-color: #057a55;
      color: #ffffff;
    `}

  ${(props) =>
    props.variant === "edit" &&
    css`
      background-color: #1c64f2;
      color: #ffffff;
    `}

  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

export const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;
