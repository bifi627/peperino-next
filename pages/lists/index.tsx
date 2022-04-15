import { Box, Center, Group, ScrollArea, Space, useMantineTheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus } from 'tabler-icons-react';
import { NewList } from "../../components/ListPage/Dialogs/NewList";
import { IconButton } from "../../components/ListPage/_styles";
import { List } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";
import { KnownRoutes } from "../../shared/knownRoutes";

interface Props
{
    lists: List[];
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const cookies = context.req.cookies;
    const token = cookies[ AUTH_TOKEN_COOKIE_NAME ]

    const url = encodeURIComponent( context.req.url ?? "" );

    if ( !token )
    {
        return {
            props: {} as Props,
            redirect: { destination: `/auth/login?redirect=${url}` }
        }
    }

    var lists = await new ListService( token ).getLists();

    return {
        props: { lists: lists }
    }
}

const Page = ( props: Props ) =>
{
    const router = useRouter();
    const notifications = useNotifications();
    const theme = useMantineTheme();

    const [ openDialog, setOpenDialog ] = useState( false );
    const [ lists, setLists ] = useState<List[]>( props.lists );

    const onDialogClose = () =>
    {
        setOpenDialog( false );
    }

    const onDialogOpen = () =>
    {
        setOpenDialog( true );
    }

    const onCreate = async ( newList: List ) =>
    {
        try
        {
            const createdList = await new ListService().createList( newList.name )
            notifications.showNotification( { title: "Neu", message: "Neue Liste wurde erstellt", color: "green", autoClose: true } );
            setLists( [ ...lists, createdList ] )
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
        finally
        {
            setOpenDialog( false );
        }
    }

    return (
        <>
            <ScrollArea style={{ height: "calc(100vh - 150px)" }}>
                <Group direction="column">
                    {lists.map( list =>
                    {
                        return (
                            <Link key={list.slug} href={KnownRoutes.Lists( list.slug )} passHref>
                                <a>{list.name}</a>
                            </Link>
                        )
                    } )}
                </Group>
            </ScrollArea>
            <Space h="md" />
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <IconButton radius={40} color={theme.white} background={theme.colors.blue[ 6 ]} onClick={onDialogOpen}>
                    <Center>
                        <Plus></Plus>
                    </Center>
                </IconButton>
            </Box>
            {openDialog && <NewList onClose={onDialogClose} onCreate={onCreate}></NewList>}
        </>
    );
}

export default Page;