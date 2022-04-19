import { Avatar, Text } from "@mantine/core";
import styled from "styled-components";
import { List } from "../../../lib/interfaces/list";

interface Props
{
    list: List;
}

const OuterBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
`;

const InnerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const ListItem = ( { list }: Props ) =>
{
    return (
        <OuterBox>
            <Avatar color="blue" radius="xl"></Avatar>
            <InnerBox>
                <Text size="md">{list.name}</Text>
                <Text weight={"lighter"} size="sm">{list.description}</Text>
                <Text weight={"lighter"} size="sm">{list.ownerName} | {new Date( list.created ).toLocaleString()}</Text>
            </InnerBox>
        </OuterBox>
    );
}