export module KnownRoutes
{
    export const Root = () => "/";
    export const Profile = ( username: string ) => `/profile/${username}`;
    export const Login = ( email = "", redirect = "" ) =>
    {
        if ( redirect !== "" )
        {
            return `/auth/${email}?redirect=${redirect}`;
        }
        return `/auth/${email}`;
    };
    export const Register = () => `/auth/register`;
    export const Secret = () => `/secret`;
    export const Demo = () => `/demo`;
    export const Lists = ( slug = "" ) => `/lists/${slug}`;
}