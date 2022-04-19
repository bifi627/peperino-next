import { observer } from "mobx-react";
import { useListContext } from "../../../hooks/store/useListStore";
import { SortableListItem } from "../../Sortables";
import { CheckableItem } from "../CheckList/CheckItem";
import { SortableCheckList } from "../CheckList/SortableCheckList";
import { ScrollBox } from "../_styles";

export const FinishedTab = observer( () =>
{
    const viewModel = useListContext();

    return (
        <ScrollBox>
            <SortableCheckList>
                {viewModel.listItems.filter( item => item.checked === true ).map( ( item, index ) =>
                {
                    return (
                        <SortableListItem key={item.id} index={index}>
                            <CheckableItem model={item} onDelete={() => viewModel.deleteItem( item )} onUpdate={() => viewModel.updateItem( item )}></CheckableItem>
                        </SortableListItem>
                    );
                } )}
            </SortableCheckList>
        </ScrollBox>
    );
} );