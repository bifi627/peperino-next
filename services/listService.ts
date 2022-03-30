import slugify from "slugify";
import { List, ListItem, MoveItemRequest } from "../lib/interfaces/list";
import { Endpoint } from "./apiConfig";
import { BaseService } from "./baseService";

export default class ListService extends BaseService
{
    public override readonly endpoint?: Endpoint = "list";

    constructor( token?: string )
    {
        super( token );
    }

    public createList( name: string )
    {
        const slug = slugify( name, { lower: true } );
        return this.post<List, List>( "", { name: name, listItems: [], slug: slug } );
    }

    public getLists()
    {
        return this.get<List[]>();
    }

    public getBySlug( slug: string )
    {
        return this.get<List>( slug );
    }

    public addTextItemToList( slug: string, item: string )
    {
        return this.post<string, ListItem>( slug + "/text", item );
    }

    public updateItem( slug: string, item: ListItem )
    {
        return this.put<ListItem, boolean>( `${slug}/${item.id}`, item );
    }

    public deleteItem( slug: string, item: ListItem )
    {
        return this.delete<boolean>( `${slug}/${item.id}` );
    }

    public moveCheckedItem( slug: string, from: number, to: number )
    {
        return this.post<MoveItemRequest, List>( slug + "/move", { from: from, to: to } );
    }
}