import { MediaQuery, Navbar, ScrollArea } from "@mantine/core";
import Link from "next/link";
import { KnownRoutes } from "../../shared/knownRoutes";
import { Logo } from "../Header/components/Logo";

interface Props
{
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

export const MainNavigationBar = ( { opened, setOpened, children }: Props ) =>
{
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
                {children}
            </Navbar.Section>

            <Navbar.Section>{
            }</Navbar.Section>
        </Navbar>
    );
}
