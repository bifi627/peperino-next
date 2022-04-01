import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import { ApiHelper, Hub } from "../services/apiConfig";

export class SignalRClient
{
    public readonly connection: signalR.HubConnection;

    constructor( hub: Hub )
    {
        this.connection = new HubConnectionBuilder().withUrl( ApiHelper.getHubRoute( hub ), { skipNegotiation: true, transport: HttpTransportType.WebSockets } ).build();
    }

    public async on<OUT>( method: string, cb: ( obj: OUT ) => void )
    {
        this.connection.on( method, cb );

        if ( !this.connection.connectionId )
        {
            await this.connection.start();
        }

        return this;
    }

    public off( method: string )
    {
        this.connection.off( method );
    }
}
