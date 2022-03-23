import { AppShell, ScrollArea } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import React from "react";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import "../lib/firebase";
import '../styles/globals.css';
export function MyApp( { Component, pageProps }: AppProps )
{
    const [ opened, setOpened ] = React.useState( false );
    return (
        <NotificationsProvider position="top-right">
            <AppShell
                navbarOffsetBreakpoint="sm"
                fixed
                padding="md"
                navbar={< Navbar opened={opened} ></Navbar >}
                header={< Header opened={opened} setOpened={setOpened} ></Header >}
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