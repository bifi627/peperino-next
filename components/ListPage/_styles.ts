import { UnstyledButton } from "@mantine/core";
import styled from "styled-components";

export const ScrollBox = styled.div`
    max-height: calc(100vh - 350px);
    overflow: auto;
`;

export const IconButton = styled( UnstyledButton ) <{ color: string, background: string, radius?: number }>`
    width: 36px;
    height: 36px;
    border-radius: ${p => p.radius ? p.radius + "px" : "0px"};
    color: ${p => p.color};
    background: ${p => p.background};
`;