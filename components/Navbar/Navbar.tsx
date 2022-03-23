import { MediaQuery, Navbar, ScrollArea, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../Header/components/Logo";

interface Props
{
    opened: boolean;
}

export default ( { opened }: Props ) =>
{
    const router = useRouter();

    return (
        <Navbar hidden={!opened} hiddenBreakpoint="sm" p="xs" width={{ base: 300 }}>
            <MediaQuery largerThan={"sm"} styles={{ display: 'none' }}>
                <div>
                    <Logo></Logo>
                    <hr></hr>
                </div>
            </MediaQuery>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                <Navbar.Section mt="xs">{
                    <Link href="/demo" passHref>
                        <Text>Demo</Text>
                    </Link>
                }</Navbar.Section>
                <Navbar.Section mt="xs">{
                    <Link href="/secret" passHref>
                        <Text>Secret</Text>
                    </Link>
                }</Navbar.Section>
            </Navbar.Section>

            <Navbar.Section>{
                <Text>Navbar Footer</Text>
            }</Navbar.Section>
        </Navbar>
    );
}