import { Box, Button, ScrollArea, Space } from "@mantine/core";
import { GetServerSideProps } from "next";
import { Plus } from 'tabler-icons-react';
import { List } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";

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

export default ( props: Props ) =>
{
    console.log( props.lists );
    return (
        <>
            <ScrollArea style={{ height: "calc(100vh - 150px)" }}>
                {props.lists.map( list =>
                {
                    return (
                        <div key={list.name}>{list.name}</div>
                    )
                } )}
            </ScrollArea>
            <Space h="md" />
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <Button radius={20}>
                    <Plus></Plus>
                </Button>
            </Box>
        </>
    );
}