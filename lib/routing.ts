export module KnownRoutes
{
    export const Root = () => "/";
    export const Profile = ( username: string ) => `/profile/${username}`;
    export const Login = ( email = "" ) => `/auth/${email}`;
    export const Register = () => `/auth/register`;
    export const Secret = () => `/secret`;
    export const Demo = () => `/demo`;
}