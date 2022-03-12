import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default () =>
{
    const [ user ] = useAuthState( getAuth() );

    return user;
};
