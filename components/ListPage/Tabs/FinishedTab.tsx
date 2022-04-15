import { observer } from "mobx-react";
import { useListState } from "../../../hooks/state/useListState";
import { SortableListItem } from "../../Sortables";
import { CheckableItem } from "../CheckList/CheckItem";
import { SortableCheckList } from "../CheckList/SortableCheckList";
import { ScrollBox } from "../_styles";

export const FinishedTab = observer( () =>
{
    const viewModel = useListState();

    return (
        <ScrollBox>
            <SortableCheckList>
                {viewModel.checkedItems.map( ( item, index ) =>
                {
                    return (
                        <SortableListItem key={item.id} index={index}>
                            <CheckableItem key={item.id} model={item} onDelete={() => viewModel.deleteItem( item )} onUpdate={() => viewModel.updateItem( item )}></CheckableItem>
                        </SortableListItem>
                    );
                } )}
            </SortableCheckList>
        </ScrollBox>
    );
} );