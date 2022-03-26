export interface List
{
    name: string;
    slug: string;
    listItems: ListItem[];
}

export interface ListItem
{
    id: string;
    text: string;
    checked: boolean;
    type: ItemType;
    wait: boolean;
}

export enum ItemType
{
    Text = "Text",
    Link = "Link",
    Picture = "Picture",
    Document = "Document",
}

export interface CheckItemRequest
{
    id: string;
    checked: boolean;
}