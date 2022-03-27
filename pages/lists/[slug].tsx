import { Center, Group, ScrollArea, Space, Tabs, TextInput, UnstyledButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Send } from "tabler-icons-react";
import ListItem from "../../components/List/ListItem";
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

    const form = useForm( {
        initialValues: {
            text: "",
        },
    } );

    const addItem = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        if ( form.values.text.length > 0 )
        {
            try
            {
                const newListItem = await new ListService().addTextItemToList( list.slug, form.values.text );
                setListItems( [ ...listItems, newListItem ] );
                form.reset();

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

    };

    const [ scrolling, setScrolling ] = useState( false );
    const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout>();
    const debounceScrolling = () =>
    {
        // If pending change, cancel
        timeoutId && clearTimeout( timeoutId );
        setTimeoutId( undefined );
        setScrolling( true );
        console.log( "SCROLLING" );
        setTimeoutId( setTimeout( async () =>
        {
            setScrolling( false );
            console.log( "STOP SCROLLING" );
        }, 72 ) );
    }

    return (
        <div {...handlers} style={{ height: "calc(100vh - 150px)" }}>
            {list.name} - {list.slug} - {list.listItems.length}
            <Tabs grow position="apart" active={activeTab} onTabChange={setActiveTab}>
                <Tabs.Tab label="Offen">
                    <ScrollArea onScroll={debounceScrolling} ref={viewport} type="auto" style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "calc(100vh - 300px)" }}>
                        <Space h={"xl"}></Space>
                        <Group direction="column" style={{ maxWidth: "90vw" }}>
                            {listItems.filter( item => !item.checked ).map( item => <ListItem skipEvents={scrolling} key={item.id} pressTimeout={3000} item={item} onUpdate={updateItem} onDelete={deleteItem}></ListItem> )}
                        </Group>
                        <Space h={"xl"}></Space>
                    </ScrollArea>
                    <form style={{ display: "grid", gridTemplateColumns: "1fr 45px", gap: "10px" }} onSubmit={addItem}>
                        <TextInput
                            required
                            autoFocus
                            {...form.getInputProps( "text" )} ></TextInput>
                        <UnstyledButton type="submit" style={{ background: "#228be6", borderRadius: "20px" }}>
                            <Center>
                                <Send color={"white"}></Send>
                            </Center>
                        </UnstyledButton>
                    </form>
                </Tabs.Tab>
                <Tabs.Tab label="Fertig">
                    <ScrollArea type="auto" style={{ overflowX: "auto", maxHeight: "calc(100vh - 150px)" }}>
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

