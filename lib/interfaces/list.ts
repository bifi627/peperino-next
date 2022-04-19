export interface List
{
    name: string;
    slug: string;
    description: string;
    ownerName: string;
    created: string; // ISO String
    listItems: ListItem[];
}

export interface ListItem
{
    id: string;
    text: string;
    checked: boolean;
    type: ItemType;
}

export enum ItemType
{
    Text = "Text",
    Link = "Link",
    Picture = "Picture",
    Document = "Document",
}

export interface MoveItemRequest
{
    from: number;
    to: number;
}
