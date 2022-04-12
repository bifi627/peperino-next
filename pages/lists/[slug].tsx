import { Center, Group, Space, Tabs, TextInput, useMantineTheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";
import { Send } from "tabler-icons-react";
import { IconButton } from "../../components/Controls/IconButton";
import ListItem, { ListItemProps } from "../../components/List/ListItem";
import { SortableList } from "../../components/List/Sortables";
import { useSignal } from "../../hooks/useSignal";
import { List, ListItem as ListItemModel } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";
import { KnownRoutes } from "../../shared/knownRoutes";
import { NetworkError } from "../../shared/networkError";
import { ListViewModel } from "../../viewModels/list/ListViewModel";

interface Props
{
    list: List;
}

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

const ItemBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
    padding-left: 40px;
`;

const SwipeBox = styled.div`
    height: calc(100vh - 150px);
`;

const ScrollBox = styled.div`
    max-height: calc(100vh - 350px);
    overflow: auto;
`;

export default observer( ( { list }: Props ) =>
{
    const router = useRouter();
    const notifications = useNotifications();
    const theme = useMantineTheme();

    const [ vm ] = useState( new ListViewModel( list ) );

    const onSignal = useCallback( () =>
    {
        vm.reloadItems();
    }, [ vm ] )

    useSignal( "notification", `list_${list.slug}`, onSignal );

    const [ activeTab, setActiveTab ] = useState( 0 );

    const inputRef = useRef<HTMLInputElement>( null );
    const scrollRef = useRef<HTMLDivElement>( null );

    const handlers = useSwipeable( {
        onSwiped: ( eventData ) =>
        {
            console.log( eventData.dir );
            if ( eventData.dir === "Left" )
            {
                setActiveTab( v => v === 0 ? ++v : v );
            }
            else if ( eventData.dir === "Right" )
            {
                setActiveTab( v => v > 0 ? --v : v );
            }
        },
    } );

    const onSubmitAddItem = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        if ( inputRef.current && inputRef.current.value.length > 0 )
        {
            try
            {
                const newItem = await new ListService().addTextItemToList( list.slug, inputRef.current.value );
                vm.addItem( newItem );

                inputRef.current.value = "";

                if ( scrollRef.current )
                {
                    console.log( scrollRef.current.scrollHeight );
                    scrollRef.current.scrollTo( { top: scrollRef.current.scrollHeight, behavior: 'smooth' } );
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
            vm.updateItem( item );
        }
    };

    const deleteItem = async ( item: ListItemModel ) =>
    {
        const result = await new ListService().deleteItem( list.slug, item );
        if ( result )
        {
            vm.deleteItem( item );
        }
    };

    const onSortEnd = async ( { oldIndex, newIndex }: { oldIndex: number, newIndex: number } ) =>
    {
        vm.rearrangeCheckedItems( oldIndex, newIndex );
        await new ListService().moveCheckedItem( list.slug, oldIndex, newIndex );
    }

    return (
        <SwipeBox {...handlers}>
            {list.name} - {list.slug} - {list.listItems.length}
            <Tabs grow position="apart" active={activeTab} onTabChange={setActiveTab}>
                <Tabs.Tab label="Offen">
                    <Space h={"xl"}></Space>
                    <ScrollBox ref={scrollRef}>
                        <SortableList onSortEnd={onSortEnd} useDragHandle lockAxis="y" pressDelay={100} itemProps={vm.uncheckedItems.map( item =>
                        {
                            return {
                                item: item,
                                onUpdate: ( i ) => updateItem( i ),
                                onDelete: ( i ) => deleteItem( i ),
                                pressTimeout: 3000
                            } as ListItemProps;
                        } )}></SortableList>
                    </ScrollBox>
                    <Space h={"xl"}></Space>
                    <form style={{ display: "grid", gridTemplateColumns: "1fr 45px", gap: "10px" }} onSubmit={onSubmitAddItem}>
                        <TextInput
                            autoComplete="false"
                            ref={inputRef}
                            required
                            autoFocus
                        ></TextInput>
                        <IconButton radius={20} color={theme.white} background={theme.colors.blue[ 6 ]} type="submit">
                            <Center>
                                <Send color={"white"}></Send>
                            </Center>
                        </IconButton>
                    </form>
                </Tabs.Tab>
                <Tabs.Tab label="Fertig">
                    <ScrollBox>
                        <Space h={"xl"}></Space>
                        <Group direction="column">
                            {vm.checkedItems.map( item => 
                            {
                                return (
                                    <ItemBox key={item.id}>
                                        <ListItem item={item} onUpdate={updateItem} onDelete={deleteItem}></ListItem>
                                    </ItemBox>
                                )
                            } )}
                        </Group>
                        <Space h={"xl"}></Space>
                    </ScrollBox>
                </Tabs.Tab>
            </Tabs>
        </SwipeBox>
    );
} );
