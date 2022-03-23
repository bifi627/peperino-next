import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, onIdTokenChanged, User } from "firebase/auth";
import cookie from "js-cookie";
import { AUTH_TOKEN_COOKIE_NAME } from "../shared/constants";

const firebaseConfig = {
    apiKey: "AIzaSyB3GeqXO9V2PT_FJgg2MB1gVwjFK4vWZ_A",
    authDomain: "peperino-app.firebaseapp.com",
    projectId: "peperino-app",
    storageBucket: "peperino-app.appspot.com",
    messagingSenderId: "431297510031",
    appId: "1:431297510031:web:cea46c50c0faa241c54efa",
    measurementId: "G-3S881QKB0Y"
};

if ( getApps().length === 0 )
{
    initializeApp( firebaseConfig );
}

onAuthStateChanged( getAuth(), async ( user ) =>
{
    await setTokenForUser( user );
} );

onIdTokenChanged( getAuth(), async ( user ) =>
{
    await setTokenForUser( user );
} );

export async function setTokenForUser( user: User | null )
{
    if ( user )
    {
        const token = await user?.getIdToken();
        cookie.set( AUTH_TOKEN_COOKIE_NAME, token, { expires: 1 } );
    }

    else
    {
        cookie.remove( AUTH_TOKEN_COOKIE_NAME );
    }
}
