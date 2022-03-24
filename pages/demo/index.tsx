import { GetServerSideProps } from "next";
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

    const user = await new UserService( token ).getCurrentUser();

    return {
        props: { secret: user.username }
    }
}

export default ( props: Props ) =>
{
    return (
        <div>
            DEMO - {props.secret}
        </div>
    );
}