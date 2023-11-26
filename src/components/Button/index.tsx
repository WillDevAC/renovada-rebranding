import { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import * as S from "./styles";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactElement;
  variant?: 'default' | 'delete' | 'accept' | 'edit' | 'view';
}

export const Button = ({ children, icon, variant, ...props }: IButtonProps) => {
  return (
    <S.StyledButton variant={variant} {...props}>
      {icon && <S.IconWrapper>{icon}</S.IconWrapper>}
      {children}
    </S.StyledButton>
  );
};
