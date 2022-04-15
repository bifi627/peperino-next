import { observer } from "mobx-react";
import { useListState } from "../../hooks/state/useListState";

export const Header = observer( () =>
{
    const viewModel = useListState();
    return (
        <>
            {viewModel.name} - {viewModel.slug} - {viewModel.listItems.length}
        </>
    );
} );