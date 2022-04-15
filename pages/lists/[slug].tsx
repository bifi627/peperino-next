import { Tabs } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { useCallback, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";
import { Header } from "../../components/ListPage/Header";
import { FinishedTab } from "../../components/ListPage/Tabs/FinishedTab";
import { OpenTab } from "../../components/ListPage/Tabs/OpenTab";
import { useListService } from "../../hooks/services/useListService";
import { ListContext, useInitListState } from "../../hooks/state/useListState";
import { useSignal } from "../../hooks/useSignal";
import { List } from "../../lib/interfaces/list";
import ListService from "../../services/listService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";
import { KnownRoutes } from "../../shared/knownRoutes";
import { NetworkError } from "../../shared/networkError";

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

    // Redirect to login page if the user has not token
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

export default observer( ( { list }: Props ) =>
{
    const listService = useListService();
    const viewModel = useInitListState( list, listService );

    useSignal( "notification", `list_${list.slug}`, useCallback( () =>
    {
        viewModel.reloadItems();
    }, [ viewModel ] ) );

    const [ activeTab, setActiveTab ] = useState( 0 );

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

    return (
        <ListContext.Provider value={viewModel}>
            <SwipeBox {...handlers}>
                <Header></Header>
                <Tabs grow position="apart" active={activeTab} onTabChange={setActiveTab}>
                    <Tabs.Tab label="Offen">
                        <OpenTab />
                    </Tabs.Tab>
                    <Tabs.Tab label="Fertig">
                        <FinishedTab />
                    </Tabs.Tab>
                </Tabs>
            </SwipeBox>
        </ListContext.Provider>
    );
} );
