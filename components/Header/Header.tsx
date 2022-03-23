import { Burger, Header, MediaQuery } from "@mantine/core";
import styled from "styled-components";
import AuthCheck from "../AuthCheck";
import Login from "./components/Login";
import Logo from "./components/Logo";
import Profile from "./components/Profile";

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

export default ( { opened, setOpened }: Props ) =>
{
    return (
        <Header height={60} p="md">{
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
                        <Logo></Logo>
                    </div>
                </MediaQuery>
                <AuthCheck fallback={<Login></Login>}>
                    <Profile></Profile>
                </AuthCheck>
            </HeaderBox>
        }</Header>
    );
}