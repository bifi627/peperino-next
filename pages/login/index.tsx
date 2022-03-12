import GoogleIcon from '@mui/icons-material/Google';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { observer } from "mobx-react";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import ValidatabaleValue from "../../lib/ValidatableValue";

interface Props
{
    value: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) =>
{
    const props: Props = { value: "" };

    props.value = "TEST";

    return {
        props: props
    }
}

const Box = styled.div`
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;

    margin-top: -40%;
`;

const email = new ValidatabaleValue( "E-Mail", value => 
{
    if ( value === "" )
    {
        return "E-Mail-Adresse muss gefüllt sein";
    }

    const match = value.toLowerCase().match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );

    if ( !match )
    {
        return "E-Mail-Adresse ist falsch formatiert";
    }

    return "";
} );

const password = new ValidatabaleValue( "Passwort", value =>
{
    if ( value.length < 6 )
    {
        return "Passwort muss länger als 6 Zeichen sein"
    }

    return "";
} );

export default observer( ( props: Props ) =>
{
    const [ user, setUser ] = React.useState<User | undefined>( undefined );

    const router = useRouter();

    React.useEffect( () =>
    {
        if ( user )
        {
            router.push( "/" );
        }
    }, [ user ] )

    const onRegisterClick = async () =>
    {
        try
        {
            const register = await createUserWithEmailAndPassword( getAuth(), email.value, password.value );
        }
        catch ( error: any )
        {
            toast.error( error.message );
            console.error( error );
            email.value = "";
            password.value = "";
            email.validate() && password.validate();
        }
    }

    const onLoginClick = async () =>
    {
        if ( email.validate() && password.validate() )
        {
            try
            {
                const emailLogin = await signInWithEmailAndPassword( getAuth(), email.value, password.value );
                setUser( emailLogin.user );
            }
            catch ( error: any )
            {
                toast.error( "E-Mail-Adresse oder Passwort falsch!" );

                email.value = "";
                password.value = "";
                email.validate() && password.validate();
            }
        }
    }

    const onLogoutClick = async () =>
    {
        await signOut( getAuth() );
        setUser( undefined );
    }

    const onGoogleClick = async () =>
    {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters( { prompt: "select_account" } );
        const googleLogin = await signInWithPopup( getAuth(), googleProvider );
        setUser( googleLogin.user );
    }

    const firebaseUser = useFirebaseUser();

    if ( firebaseUser )
    {
        return (
            <Dialog open fullWidth>
                <DialogTitle>Ausloggen</DialogTitle>
                <DialogContent>
                    <Button onClick={() => onLogoutClick()} variant="contained">Ausloggen {firebaseUser.email}</Button>
                </DialogContent>
                <DialogActions>
                    <Link href="/">
                        <Button fullWidth>Zurück zur Startseite</Button>
                    </Link>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <Box>
            <Dialog open fullWidth>
                <DialogTitle>Einloggen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <label>
                            <span>Mit E-Mail-Addresse einloggen: </span>
                            {email.isValid && email.value !== "" &&
                                <span onClick={() =>
                                {
                                    email.value = "";
                                    password.value = "";
                                    email.validate() && password.validate();
                                }} style={{ textDecoration: "underline" }}>{email.value}</span>
                            }
                        </label>
                    </DialogContentText>
                    <Stack spacing={4} mt={2} divider=
                        {
                            <Divider orientation="horizontal" flexItem />
                        }>
                        <Stack spacing={2}>

                            {( !email.isValid || email.value === "" ) && <Stack spacing={2}>
                                <TextField autoFocus helperText={email.errorText} error={email.hasError} onChange={e => email.value = e.currentTarget.value} fullWidth size="small" label="E-Mail" variant="outlined" required type="email" />
                                <Button onClick={e =>
                                {
                                    email.validate();
                                }} fullWidth variant="contained">Weiter</Button>
                            </Stack>}
                            {email.isValid && email.value !== "" &&
                                <>
                                    <TextField autoFocus helperText={password.errorText} error={password.hasError} onChange={e => password.value = e.currentTarget.value} fullWidth size="small" label="Passwort" variant="outlined" type="password" required />
                                    <Stack spacing={2} direction="row">
                                        <Button onClick={() => onLoginClick()} fullWidth variant="contained">Einloggen</Button>
                                        <Button onClick={() => onRegisterClick()} fullWidth variant="contained">Registrieren</Button>
                                    </Stack>
                                </>
                            }
                        </Stack>
                        <Stack spacing={2}>
                            <DialogContentText>
                                Mit Anbieter einloggen
                            </DialogContentText>
                            <Button onClick={() => onGoogleClick()} startIcon={<GoogleIcon />} variant="contained">Google</Button>
                            {user && <Button onClick={() => onLogoutClick()} variant="contained">Ausloggen {user.email}</Button>}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Link href="/">
                        <Button fullWidth>Zurück zur Startseite</Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Box>
    );
} );

