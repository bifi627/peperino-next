import { createContext, useContext, useEffect, useState } from "react";
import { List } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { ListViewModel } from "../../store/list/ListViewModel";

export const ListContext = createContext<ListViewModel | undefined>( undefined );

interface ListInit
{
    data: List;
}

interface Depenencies
{
    listService: ListService;
    externalId: string;
}

export const useListStore = ( init: ListInit, depenencies: Depenencies ) =>
{
    const [ listState ] = useState( new ListViewModel( init.data, depenencies.listService, depenencies.externalId ) );

    useEffect( () =>
    {
        listState.initNotifications();
        return () =>
        {
            listState.dispose();
        }
    }, [ listState ] )

    return listState;
}

export const useListContext = () =>
{
    const context = useContext( ListContext );

    if ( context === undefined )
    {
        throw new Error( "ListViewContext not set!" );
    }

    return context;
}