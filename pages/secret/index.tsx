import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import React from "react";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import { BaseService } from "../../services/baseService";
import UserService from "../../services/userService";
import { AUTH_TOKEN_COOKIE_NAME } from "../../shared/constants";

interface Props
{
    secret: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const cookies = context.req.cookies;
    const token = cookies[ AUTH_TOKEN_COOKIE_NAME ]

    const url = encodeURIComponent( context.req.url ?? "" );

    if ( !token )
    {
        return {
            props: {} as Props,
            redirect: { destination: `auth/login?redirect=${url}` }
        }
    }

    BaseService.token = token;

    const user = await new UserService().getCurrentUser();

    return {
        props: { secret: user.username }
    }
}

export default ( props: Props ) =>
{
    const user = useFirebaseUser();
    const router = useRouter();

    return (
        <>{props.secret}</>
    );
}