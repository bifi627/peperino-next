import { MediaQuery, Navbar, ScrollArea, Text } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { KnownRoutes } from "../../lib/routing";
import ConfigService from "../../services/configService";
import Logo from "../Header/components/Logo";

interface Props
{
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ( { opened, setOpened }: Props ) =>
{
    const router = useRouter();
    const notifications = useNotifications();

    const [ isAlive, setIsAlive ] = useState( false );

    const checkServerState = async () =>
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
    }

    useEffect( () =>
    {
        checkServerState();
    }, [] );

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
                <Navbar.Section mt="xs">{
                    <Link href={KnownRoutes.Demo()} passHref>
                        <Text onClick={() =>
                        {
                            setOpened( false );
                        }} component="a">Demo</Text>
                    </Link>
                }</Navbar.Section>
                <Navbar.Section mt="xs">{
                    <Link href={KnownRoutes.Secret()} passHref>
                        <Text onClick={() =>
                        {
                            setOpened( false );
                        }} component="a">Secret</Text>
                    </Link>
                }</Navbar.Section>
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
