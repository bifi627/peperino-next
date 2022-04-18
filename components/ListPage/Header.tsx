import { observer } from "mobx-react";
import { useListContext } from "../../hooks/store/useListStore";

export const Header = observer( () =>
{
    const viewModel = useListContext();
    return (
        <>
            {viewModel.name} - {viewModel.slug} - {viewModel.listItems.length} - {viewModel.ConnectionState}
        </>
    );
} );