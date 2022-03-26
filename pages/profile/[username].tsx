import { Button, Text } from '@mantine/core';
import { useNotifications } from "@mantine/notifications";
import { getAuth, signOut } from "firebase/auth";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
import { User } from "../../lib/interfaces/user";
import UserService from "../../services/userService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";
import { KnownRoutes } from "../../shared/knownRoutes";

interface Props
{
    user: User;
    isSelf: boolean;
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const username = context.params?.username;

    if ( !username || Array.isArray( username ) )
    {
        return {
            props: {} as Props,
            notFound: true,
        }
    }

    if ( await new UserService().checkUsername( username ) === true )
    {
        return {
            props: {} as Props,
            notFound: true,
        }
    }

    const cookies = context.req.cookies;
    const token = cookies[ AUTH_TOKEN_COOKIE_NAME ]

    const url = encodeURIComponent( context.req.url ?? "" );

    if ( !token )
    {
        return {
            props: {} as Props,
            redirect: { destination: `/auth/login?redirect=${url}` }
        }
    }

    const user = await new UserService( token ).getUserByUsername( username );
    const currentUser = await new UserService( token ).getCurrentUser();
    return {
        props: { user: user, isSelf: user.externalId.toLowerCase() === currentUser.externalId.toLowerCase() }
    }
}

export default ( props: Props ) =>
{
    const router = useRouter();
    const user = useUser();
    const notifications = useNotifications();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {props.isSelf && <Button onClick={async () =>
            {
                signOut( getAuth() );
                await router.push( KnownRoutes.Root() );
            }}>Logout</Button>}
            <Text>Username: {props.user.username}</Text>
            <Text>ExternalId: {props.user.externalId}</Text>
            <Text>IsSelf: {`${props.isSelf}`}</Text>
            {props.isSelf && <Button color="red" onClick={async () =>
            {
                if ( user?.peperinoUser )
                {
                    try
                    {
                        await new UserService().deleteUser( user.peperinoUser );
                        signOut( getAuth() );
                        await router.push( KnownRoutes.Root() );
                    }
                    catch ( error: any )
                    {
                        notifications.showNotification( { title: "Fehler", message: error.message, color: "red" } );
                    }
                }
            }}>LÖSCHEN</Button>}
        </div>
    );
}