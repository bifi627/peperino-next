import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { arrayMoveImmutable } from "array-move";
import { action, computed, isObservableArray, makeObservable, observable } from "mobx";
import { List, ListItem } from "../../lib/interfaces/list";
import { ApiHelper } from "../../services/apiConfig";
import ListService from "../../services/listService";
import { ListItemViewModel } from "./ListItemViewModel";

export class ListViewModel implements List
{
    private readonly listService: ListService;

    public readonly name: string;
    public readonly slug: string;
    public readonly description: string;
    public readonly ownerName: string;
    public readonly created: string;

    @observable
    public readonly listItems: ListItemViewModel[] = [];

    @computed
    public get checkedItems()
    {
        return this.listItems.filter( item => item.checked === true );
    }

    @computed
    public get uncheckedItems()
    {
        return this.listItems.filter( item => item.checked === false )
    }

    private notificationHubConnection!: HubConnection;

    @observable
    private _connectionState: HubConnectionState = HubConnectionState.Disconnected;
    public get ConnectionState()
    {
        return this._connectionState;
    }

    constructor( data: List, listService: ListService )
    {
        this.listService = listService;

        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.ownerName = data.ownerName;
        this.created = data.created;

        this.updateDataFromModel( ...data.listItems );

        makeObservable( this );
    }

    private updateDataFromModel( ...listItemModels: ListItem[] )
    {
        listItemModels.forEach( model =>
        {
            const existingItem = this.listItems.find( item => item.id === model.id )
            if ( !existingItem )
            {
                this.listItems.push( new ListItemViewModel( model ) )
            }
            else
            {
                existingItem.updateFromModel( model )
            }
        } );
    }

    public async initNotifications( user: string )
    {
        this.notificationHubConnection = new HubConnectionBuilder().withUrl( ApiHelper.getHubRoute( "list" ),
            {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            } ).withAutomaticReconnect().build();

        this.registerWebSocketEvents();

        this.notificationHubConnection.on( "Update", async ( sender: string ) =>
        {
            // if ( user !== sender )
            {
                await this.reloadItems();
                this._connectionState = this.notificationHubConnection.state;
            }
        } );

        await this.notificationHubConnection.start();
        await this.notificationHubConnection.send( "JoinList", this.slug );
    }

    private registerWebSocketEvents()
    {
        this.notificationHubConnection.onclose( () =>
        {
            this._connectionState = this.notificationHubConnection.state;
        } );

        this.notificationHubConnection.onreconnected( () =>
        {
            this._connectionState = this.notificationHubConnection.state;
        } )
        this.notificationHubConnection.onreconnecting( () =>
        {
            this._connectionState = this.notificationHubConnection.state;
        } )

        this.notificationHubConnection.on( "connected", () =>
        {
            this._connectionState = this.notificationHubConnection.state;
        } );
    }

    public dispose()
    {
        this.notificationHubConnection.state === HubConnectionState.Connected && this.notificationHubConnection.send( "LeaveList", this.slug ).then( () =>
        {
            this.notificationHubConnection.stop();
        } );
    }

    @action
    public async reloadItems()
    {
        if ( isObservableArray( this.listItems ) )
        {
            const list = await this.listService.getBySlug( this.slug );
            this.listItems.replace( list.listItems.map( ( item => new ListItemViewModel( item ) ) ) );

            // this.updateDataFromModel( ...list.listItems );
        }
    }

    @action
    public async addItem( value: string )
    {
        const item = await new ListService().addTextItemToList( this.slug, value );
        this.updateDataFromModel( item );
    }

    @action
    public async updateItem( updatedItem: ListItem )
    {
        this.updateDataFromModel( updatedItem );
        await this.listService.updateItem( this.slug, updatedItem );
    }

    @action
    public async deleteItem( deletedItem: ListItem )
    {
        this.listItems.splice( this.listItems.findIndex( x => x.id === deletedItem.id ), 1 );
        await this.listService.deleteItem( this.slug, deletedItem );
    }

    @action
    public async rearrangeCheckedItems( oldIndex: number, newIndex: number )
    {
        if ( isObservableArray( this.listItems ) )
        {
            // TODO: Implement index property --> the ui should not depend on the actual array positions
            this.listItems.replace( [ ...arrayMoveImmutable( this.listItems.filter( i => i.checked === false ), oldIndex, newIndex ), ...this.listItems.filter( i => i.checked === true ) ] )
        }

        await this.listService.moveCheckedItem( this.slug, oldIndex, newIndex );
    }
}