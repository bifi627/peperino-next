import { arrayMoveImmutable } from "array-move";
import { action, computed, isObservableArray, makeObservable, observable } from "mobx";
import { List, ListItem } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { ListItemViewModel } from "./ListItemViewModel";

export class ListViewModel implements List
{
    private readonly listService: ListService;

    public readonly name: string;
    public readonly slug: string;

    @observable
    public readonly listItems: ListItemViewModel[];

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

    constructor( data: List, listService: ListService )
    {
        this.listService = listService;

        this.name = data.name;
        this.slug = data.slug;
        this.listItems = data.listItems.map( i => new ListItemViewModel( i ) );

        makeObservable( this );
    }

    @action async reloadItems()
    {
        if ( isObservableArray( this.listItems ) )
        {
            const list = await this.listService.getBySlug( this.slug );
            this.listItems.replace( list.listItems );
        }
    }

    @action
    public async addItem( value: string )
    {
        const item = await new ListService().addTextItemToList( this.slug, value );
        this.listItems.push( item );
    }

    @action
    public async updateItem( updatedItem: ListItem )
    {
        this.listItems.splice( this.listItems.findIndex( x => x.id === updatedItem.id ), 1, updatedItem );
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
            this.listItems.replace( [ ...arrayMoveImmutable( this.listItems.filter( i => i.checked === false ), oldIndex, newIndex ), ...this.listItems.filter( i => i.checked === true ) ] )
        }

        await this.listService.moveCheckedItem( this.slug, oldIndex, newIndex );
    }
}