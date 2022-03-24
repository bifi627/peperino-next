import { List } from "../lib/interfaces/list";
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
        return this.post<List, List>( "", { name: name, listItems: [] } );
    }

    public getLists()
    {
        return this.get<List[]>();
    }
}