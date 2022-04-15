import { Burger, Header as MantineHeader, MediaQuery } from "@mantine/core";
import Link from "next/link";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import { KnownRoutes } from "../../shared/knownRoutes";
import { AuthCheck } from "../AuthCheck";
import { Login } from "./components/Login";
import { Logo } from "./components/Logo";
import { Profile } from "./components/Profile";

interface Props
{
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const Header = ( { opened, setOpened }: Props ) =>
{
    const user = useUser();

    return (
        <MantineHeader height={60} p="md">{
            <HeaderBox>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened( ( o ) => !o )}
                        size="sm"
                        mr="xl"
                    />
                </MediaQuery>
                <MediaQuery smallerThan={"sm"} styles={{ display: 'none' }}>
                    <div>
                        <Link href={KnownRoutes.Root()}>
                            <a>
                                <Logo />
                            </a>
                        </Link>
                    </div>
                </MediaQuery>
                <AuthCheck fallback=
                    {
                        // Render Login-Button if user is not logged in
                        <Link href={KnownRoutes.Login()}>
                            <a>
                                <Login />
                            </a>
                        </Link>
                    }>
                    <Link href={KnownRoutes.Profile( user?.peperinoUser?.username ?? "" )}>
                        <a>
                            <Profile />
                        </a>
                    </Link>
                </AuthCheck>
            </HeaderBox>
        }</MantineHeader>
    );
}