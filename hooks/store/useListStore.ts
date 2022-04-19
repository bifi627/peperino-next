import { HubConnectionState } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useMemo } from "react";
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

export const useListStore = ( list: List, listService: ListService, externalId: string ) =>
{
    const listState = useMemo( () => new ListViewModel( list, listService ), [ list, listService ] );

    useEffect( () =>
    {
        if ( externalId )
        {
            listState.initNotifications( externalId );
        }

        return () =>
        {
            if ( listState.ConnectionState !== HubConnectionState.Disconnected )
            {
                listState.dispose();
            }
        }
    }, [ externalId ] );

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