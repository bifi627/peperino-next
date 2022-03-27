import { Group } from "@mantine/core";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
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

export const SortableListItem = SortableElement( ( props: ListItemProps ) =>
{
    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "20px", width: "100%" }}>
            <DragHandle />
            <ListItem {...props}></ListItem>
        </div>
    );
} );

export const DragHandle = SortableHandle( () => <Menu /> );