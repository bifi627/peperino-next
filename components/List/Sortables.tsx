import { Group } from "@mantine/core";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import styled from "styled-components";
import { Menu } from "tabler-icons-react";
import ListItem, { ListItemProps } from "./ListItem";
interface Props
{
    itemProps: ListItemProps[]
}
export const SortableList = SortableContainer( ( props: Props ) =>
{
    return (
        <Group direction="column" style={{ maxWidth: "90vw", gap: "10px" }}>
            {props.itemProps.map( ( p, index ) => <SortableListItem index={index} key={p.item.id} {...p}></SortableListItem> )}
        </Group>
    );
} );

const ItemBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
    align-items: center;
`;

export const SortableListItem = SortableElement( ( props: ListItemProps ) =>
{
    return (
        <ItemBox>
            <DragHandle />
            <ListItem {...props}></ListItem>
        </ItemBox>
    );
} );

export const DragHandle = SortableHandle( () => <Menu /> );