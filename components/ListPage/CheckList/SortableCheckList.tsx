import { useListContext } from "../../../hooks/store/useListStore";
import { SortableList } from "../../Sortables";

interface Props
{
    children: React.ReactNode;
}

export const SortableCheckList = ( props: Props ) =>
{
    const listViewModel = useListContext();

    const onSortEnd = async ( { oldIndex, newIndex }: { oldIndex: number, newIndex: number } ) =>
    {
        await listViewModel.rearrangeCheckedItems( oldIndex, newIndex );
    }

    return (
        <SortableList onSortEnd={onSortEnd} useDragHandle lockAxis="y" pressDelay={100}>
            {props.children}
        </SortableList>
    );
}
