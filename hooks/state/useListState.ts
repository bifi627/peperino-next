import { createContext, useContext, useMemo } from "react";
import { List } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { ListViewModel } from "../../state/list/ListViewModel";

export const ListContext = createContext<ListViewModel | undefined>( undefined );

export const useInitListState = ( list: List, listService: ListService ) =>
{
    return useMemo( () => new ListViewModel( list, listService ), [ list, listService ] );
}

export const useListState = () =>
{
    const context = useContext( ListContext );

    if ( context === undefined )
    {
        throw new Error( "ListViewContext not set!" );
    }

    return context;
}