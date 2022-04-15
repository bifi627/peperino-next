import { MediaQuery, Navbar, ScrollArea, Text } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ConfigService from "../../services/configService";
import { KnownRoutes } from "../../shared/knownRoutes";
import { Logo } from "../Header/components/Logo";
import { NavigationItem } from "./NavigationItem";

interface Props
{
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    navigationItems: NavigationItem[];
}

export const MainNavigationBar = ( { opened, setOpened, navigationItems }: Props ) =>
{
    const notifications = useNotifications();

    const [ isAlive, setIsAlive ] = useState( false );

    const checkServerState = useCallback( async () =>
    {
        try
        {
            const alive = await new ConfigService().check()
            setIsAlive( alive );
        }
        catch ( error: any )
        {
            notifications.showNotification( { title: "Fehler", message: error.message, color: "red" } );
            setIsAlive( false )
        }
    }, [ notifications ] )

    useEffect( () =>
    {
        checkServerState();
    }, [ checkServerState ] );

    return (
        <Navbar hidden={!opened} hiddenBreakpoint="sm" p="xs" width={{ base: 300 }}>
            <MediaQuery largerThan={"sm"} styles={{ display: 'none' }}>
                <div>
                    <Link href={KnownRoutes.Root()} passHref>
                        <a onClick={() =>
                        {
                            setOpened( false );
                        }}>
                            <Logo></Logo>
                        </a>
                    </Link>
                    <hr></hr>
                </div>
            </MediaQuery>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                {navigationItems.map( item =>
                {
                    return (
                        <Navbar.Section key={item.title} mt="xs">{
                            <Link href={item.route} passHref>
                                <Text onClick={() =>
                                {
                                    setOpened( false );
                                }} component="a">{item.title}</Text>
                            </Link>
                        }</Navbar.Section>
                    );
                } )}
            </Navbar.Section>

            <Navbar.Section>{
                <Text onClick={async () =>
                {
                    await checkServerState();
                }}>{isAlive ? "alive" : "dead"}</Text>
            }</Navbar.Section>
        </Navbar>
    );
}
