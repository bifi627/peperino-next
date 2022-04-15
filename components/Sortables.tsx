import { Group } from "@mantine/core";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import { Menu } from "tabler-icons-react";

interface Props
{
    children: React.ReactNode;
}

const StyledGroup = styled( Group )`
    max-width: 90vw;
    gap: 10px;
`;

export const SortableList = SortableContainer( ( props: Props ) =>
{
    return (
        <StyledGroup direction="column">
            {props.children}
        </StyledGroup>
    );
} );

const ItemBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
    align-items: center;
`;

interface ItemProps
{
    children: React.ReactNode;
    showDragHandle?: boolean;
}

export const SortableListItem = SortableElement( ( props: ItemProps ) =>
{
    return (
        <ItemBox>
            {props.showDragHandle && <DragHandle />}
            {props.children}
        </ItemBox>
    );
} );

export const DragHandle = SortableHandle( () => <Menu /> );