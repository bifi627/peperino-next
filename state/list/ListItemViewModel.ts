import { observable } from "mobx";
import { ItemType, ListItem } from "../../lib/interfaces/list";

export class ListItemViewModel implements ListItem
{
    @observable
    public id: string;

    @observable
    public text: string;

    @observable
    public checked: boolean;

    @observable
    public type: ItemType;

    @observable
    public wait: boolean;

    constructor( data: ListItem )
    {
        this.id = data.id;
        this.text = data.text;
        this.checked = data.checked;
        this.type = data.type;
        this.wait = data.wait;
    }
}