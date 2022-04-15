import { AppShell, ScrollArea } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import React from "react";
import { Header } from "../components/Header/Header";
import { MainNavigationBar } from "../components/Navbar/MainNavigationBar";
import { NavigationItem } from "../components/Navbar/NavigationItem";
import "../lib/firebase";
import { KnownRoutes } from "../shared/knownRoutes";
import '../styles/globals.css';

export function MyApp( { Component, pageProps }: AppProps )
{
    const [ opened, setOpened ] = React.useState( false );

    // TODO: Navigation Service to fetch dynamic navigation from server
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
                navbar={< MainNavigationBar navigationItems={navigationItems} opened={opened} setOpened={setOpened}></MainNavigationBar >}
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