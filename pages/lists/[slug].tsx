import { Center, Group, ScrollArea, Space, Tabs, TextInput, UnstyledButton } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { arrayMoveImmutable } from "array-move";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Send } from "tabler-icons-react";
import ListItem, { ListItemProps } from "../../components/List/ListItem";
import { SortableList } from "../../components/List/Sortables";
import { List, ListItem as ListItemModel } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";
import { KnownRoutes } from "../../shared/knownRoutes";
import { NetworkError } from "../../shared/networkError";

interface Props
{
    list: List;
}

const applyChangeTimeoutMs = 3000;

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const cookies = context.req.cookies;
    const token = cookies[ AUTH_TOKEN_COOKIE_NAME ]
    const slug = context.query[ "slug" ] as string;

    const url = encodeURIComponent( context.req.url ?? "" );

    if ( !token )
    {
        return {
            props: {} as Props,
            redirect: { destination: KnownRoutes.Login( undefined, url ) }
        }
    }

    try
    {
        var list = await new ListService( token ).getBySlug( slug );

        return {
            props: { list: list }
        }
    }
    catch ( error )
    {
        if ( NetworkError.isNetworkError( error ) )
        {
            if ( error.response.status === 404 )
            {
                return {
                    props: {} as Props,
                    notFound: true,
                }
            }
        }
        // TODO: Build custom error pages
        throw error;
    }
}

export default ( { list }: Props ) =>
{
    const router = useRouter();
    const notifications = useNotifications();

    const viewport = useRef<HTMLDivElement>( null );

    const handlers = useSwipeable( {
        onSwiped: ( eventData ) =>
        {
            console.log( eventData.dir );
            if ( eventData.dir === "Left" )
            {
                setActiveTab( v => v == 0 ? ++v : v );
            }
            else if ( eventData.dir === "Right" )
            {
                setActiveTab( v => v > 0 ? --v : v );
            }
        },
    } );

    const [ listItems, setListItems ] = useState( list.listItems );

    const [ activeTab, setActiveTab ] = useState( 0 );

    const addItem = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        if ( inputRef.current && inputRef.current.value.length > 0 )
        {
            try
            {
                const newListItem = await new ListService().addTextItemToList( list.slug, inputRef.current.value );
                setListItems( [ ...listItems, newListItem ] );
                inputRef.current.value = "";

                if ( viewport.current )
                {
                    console.log( viewport.current.scrollHeight );
                    viewport.current.scrollTo( { top: viewport.current.scrollHeight, behavior: 'smooth' } );
                }

            }
            catch ( error: any )
            {
                notifications.showNotification( {
                    title: "Fehler", message: error.message, color: "red", autoClose: false, onClose: () =>
                    {
                        router.reload();
                    }
                } );
            }
        }
    }

    const updateItem = async ( item: ListItemModel ) =>
    {
        const result = await new ListService().updateItem( list.slug, item );
        if ( result )
        {
            setListItems( prev =>
            {
                prev.splice( prev.findIndex( x => x.id === item.id ), 1, item );
                return [ ...prev ];
            } );
        }
    };

    const deleteItem = async ( item: ListItemModel ) =>
    {
        const result = await new ListService().deleteItem( list.slug, item );
        if ( result )
        {
            setListItems( prev =>
            {
                prev.splice( prev.findIndex( x => x.id === item.id ), 1 );
                return [ ...prev ];
            } );
        }
    };

    const inputRef = useRef<HTMLInputElement>( null );

    const onSortEnd = async ( { oldIndex, newIndex }: { oldIndex: number, newIndex: number } ) =>
    {
        setListItems( prev =>
        {
            return [ ...arrayMoveImmutable( prev, oldIndex, newIndex ) ];
        } );
        const result = await new ListService().moveItem( list.slug, oldIndex, newIndex );
        if ( !result )
        {
            alert( "???" );
        }
    }

    return (
        <div {...handlers} style={{ height: "calc(100vh - 150px)" }}>
            {list.name} - {list.slug} - {list.listItems.length}
            <Tabs grow position="apart" active={activeTab} onTabChange={setActiveTab}>
                <Tabs.Tab label="Offen">
                    <Space h={"xl"}></Space>
                    <div ref={viewport} style={{ maxHeight: "calc(100vh - 350px)", overflow: "auto" }}>
                        <SortableList onSortEnd={onSortEnd} useDragHandle lockAxis="y" pressDelay={100} itemProps={listItems.filter( item => !item.checked ).map( item =>
                        {
                            return {
                                item: item,
                                onUpdate: ( i ) => updateItem( i ),
                                onDelete: ( i ) => deleteItem( i ),
                                pressTimeout: 3000
                            } as ListItemProps;
                        } )}></SortableList>
                    </div>
                    {/* {listItems.filter( item => !item.checked ).map( ( item, index ) => <SortableListItem skipEvents={scrolling} key={item.id} pressTimeout={3000} item={item} onUpdate={updateItem} onDelete={deleteItem} index={index}></SortableListItem> )} */}
                    <Space h={"xl"}></Space>
                    <form style={{ display: "grid", gridTemplateColumns: "1fr 45px", gap: "10px" }} onSubmit={addItem}>
                        <TextInput
                            autoComplete="false"
                            ref={inputRef}
                            required
                            autoFocus
                        ></TextInput>
                        <UnstyledButton type="submit" style={{ background: "#228be6", borderRadius: "20px" }}>
                            <Center>
                                <Send color={"white"}></Send>
                            </Center>
                        </UnstyledButton>
                    </form>
                </Tabs.Tab>
                <Tabs.Tab label="Fertig">
                    <ScrollArea type="auto" style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "calc(100vh - 150px)" }}>
                        <Space h={"xl"}></Space>
                        <Group direction="column">
                            {listItems.filter( item => item.checked ).map( item => <ListItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem}></ListItem> )}
                        </Group>
                        <Space h={"xl"}></Space>
                    </ScrollArea>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
}

