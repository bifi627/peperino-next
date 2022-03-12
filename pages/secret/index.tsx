import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import React from "react";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";

interface Props
{
    secret: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const cookies = context.req.cookies;

    if ( cookies )
    {
        const cookie = cookies[ AUTH_TOKEN_COOKIE_NAME ]

        if ( cookie )
        {
        }
    }

    const props: Props = { secret: "" };

    props.secret = "TEST";
    return {
        props: props
    }
}

export default ( props: Props ) =>
{
    const user = useFirebaseUser();
    const router = useRouter();

    React.useEffect( () =>
    {
        if ( !user )
        {
            router.push( "/login" );
        }
    }, [ user ] )

    return (
        <>{props.secret}</>
    );
}