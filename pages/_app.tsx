import { AppShell, Navbar, ScrollArea, Text } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Link from "next/link";
import React from "react";
import { } from "tabler-icons-react";
import { Header } from "../components/Header/Header";
import { MainNavigationBar } from "../components/Navbar/MainNavigationBar";
import { NavigationItem } from "../components/Navbar/NavigationItem";
import "../lib/firebase";
import { KnownRoutes } from "../shared/knownRoutes";
import '../styles/globals.css';

export function MyApp( { Component, pageProps }: AppProps )
{
    const [ opened, setOpened ] = React.useState( false );

    // TODO: Navigation Service to fetch dynamic navigation from server e. g. favorites
    const navigationItems: NavigationItem[] = [
        {
            title: "Meine Listen",
            route: KnownRoutes.Lists()
        }
    ];

    return (
        <NotificationsProvider position="top-right">
            <AppShell
                navbarOffsetBreakpoint="sm"
                fixed
                padding="md"
                navbar={
                    <MainNavigationBar opened={opened} setOpened={setOpened}>
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
                    </MainNavigationBar>
                }
                header={< Header opened={opened} setOpened={setOpened}></Header >}
                styles={( theme ) => ( {
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[ 8 ] : theme.colors.gray[ 0 ] }
                } )}
            >
                <ScrollArea>
                    <Component {...pageProps} />
                </ScrollArea>
            </AppShell >
        </NotificationsProvider >
    );
}

export default MyApp;