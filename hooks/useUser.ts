import { getAuth, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { User as PeperinoUser } from "../lib/interfaces/user";
import { useUserManagementService } from "./services/useUserManagementService";

interface UserState
{
    firebaseUser: User;
    peperinoUser?: PeperinoUser;
}

export const useUser = () =>
{
    const userManagementService = useUserManagementService();

    const [ userState, setUserState ] = useState<UserState | undefined>( undefined );
    const [ user ] = useAuthState( getAuth() );

    useEffect( () =>
    {
        ( async () =>
        {
            if ( user )
            {
                try
                {
                    const peperinoUser = await userManagementService.getCurrentUser();
                    if ( peperinoUser )
                    {
                        setUserState( { firebaseUser: user, peperinoUser: peperinoUser } )
                    }
                }
                catch
                {
                    setUserState( { firebaseUser: user } )
                }
            }
            else
            {
                setUserState( undefined );
            }
        } )();
    }, [ user, userManagementService ] );

    return userState;
};
