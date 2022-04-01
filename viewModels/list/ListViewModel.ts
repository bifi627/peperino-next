import { arrayMoveImmutable } from "array-move";
import { action, computed, isObservableArray, makeObservable, observable } from "mobx";
import { List, ListItem } from "../../lib/interfaces/list";
import ListService from "../../services/listService";

export class ListViewModel implements List
{
    public readonly name: string;
    public readonly slug: string;

    @observable
    public readonly listItems: ListItem[];

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

    constructor( data: List )
    {
        this.name = data.name;
        this.slug = data.slug;
        this.listItems = data.listItems;

        makeObservable( this );
    }

    @action async reloadItems()
    {
        if ( isObservableArray( this.listItems ) )
        {
            const list = await new ListService().getBySlug( this.slug );
            this.listItems.replace( list.listItems );
        }
    }

    @action
    public addItem( newListItem: ListItem )
    {
        this.listItems.push( newListItem );
    }

    @action
    public updateItem( updatedItem: ListItem )
    {
        this.listItems.splice( this.listItems.findIndex( x => x.id === updatedItem.id ), 1, updatedItem );
    }

    @action
    public deleteItem( deletedItem: ListItem )
    {
        this.listItems.splice( this.listItems.findIndex( x => x.id === deletedItem.id ), 1 );
    }

    @action
    public rearrangeCheckedItems( oldIndex: number, newIndex: number )
    {
        if ( isObservableArray( this.listItems ) )
        {
            this.listItems.replace( [ ...arrayMoveImmutable( this.listItems.filter( i => i.checked === false ), oldIndex, newIndex ), ...this.listItems.filter( i => i.checked === true ) ] )
        }
    }
}