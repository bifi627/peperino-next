import { MediaQuery, Navbar, ScrollArea, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { KnownRoutes } from "../../lib/routing";
import Logo from "../Header/components/Logo";

interface Props
{
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ( { opened, setOpened }: Props ) =>
{
    const router = useRouter();

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
                <Text>Navbar Footer</Text>
            }</Navbar.Section>
        </Navbar>
    );
}