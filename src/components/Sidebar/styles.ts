import styled from 'styled-components';
import { border_rounded } from '../../styles/variables';

export const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 5rem;
`;


export const Logo = styled.img `
    max-width: 14rem;
`

export const WrapperOptions = styled.div `
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    gap: 0.5rem;
`;

export const Option = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-left: 0.3rem;

    &:hover {
        cursor: pointer;
        background-color: #23232b;
        border: ${border_rounded};
    }
`

export const OptionTitle = styled.p `
    display: flex;
    font-size: 1rem;
`