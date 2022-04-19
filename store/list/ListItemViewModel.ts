import { action, makeObservable, observable } from "mobx";
import { ItemType, ListItem } from "../../lib/interfaces/list";

export class ListItemViewModel implements ListItem
{
    @observable
    public id: string;

    @observable
    public text = "";

    @observable
    public checked = false;

    @observable
    public type = ItemType.Text;

    constructor( data: ListItem )
    {
        this.id = data.id;

        this.updateFromModel( data );

        makeObservable( this );
    }

    @action
    public updateFromModel( model: ListItem )
    {
        this.text = model.text;
        this.checked = model.checked;
        this.type = model.type;
    }
}