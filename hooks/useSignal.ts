import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect } from "react";
import { ApiHelper, Hub } from "../services/apiConfig";

export function useSignal( route: Hub, method: string, cb: () => void )
{
    useEffect( () =>
    {
        const hubConnection = new HubConnectionBuilder().withUrl( ApiHelper.getHubRoute( route ), { skipNegotiation: true, transport: HttpTransportType.WebSockets } ).build();

        hubConnection.start();

        hubConnection.on( method, state =>
        {
            cb();
        } );

        return () =>
        {
            hubConnection.off( method );
        };
    }, [ route, method, cb ] );
}