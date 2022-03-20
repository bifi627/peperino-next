import GoogleIcon from '@mui/icons-material/Google';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { observer } from "mobx-react";
import toast from "react-hot-toast";
import ValidatabaleValue from "../../lib/ValidatableValue";
import { User } from "../../models/user";
import UserService from "../../services/userService";

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

interface Props
{
    opened: boolean;
    noCancel?: boolean;
    onLogin: ( user: User ) => void;
    onRegister: ( user: User ) => void;
    onCancel?: () => void;
}

export default observer( ( { opened, onLogin, onRegister, onCancel, noCancel = false }: Props ) =>
{
    const onRegisterClick = async () =>
    {
        try
        {
            const register = await createUserWithEmailAndPassword( getAuth(), email.value, password.value );
            const externalId = register.user.uid;

            if ( register.user.email && externalId )
            {
                const user = await new UserService().createNewUser( register.user.email, externalId );

                if ( user )
                {
                    onRegister( user );
                }
            }
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

                try
                {
                    const user = await new UserService().getCurrentUser();

                    if ( user )
                    {
                        onLogin( user );
                    }
                }
                catch ( innerError: any )
                {
                    console.error( innerError );
                }
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

    const onGoogleClick = async () =>
    {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters( { prompt: "select_account" } );
        const register = await signInWithPopup( getAuth(), googleProvider );

        const externalId = register.user.uid;

        if ( register.user.email && externalId )
        {
            const user = await new UserService().createNewUser( register.user.email, externalId );

            if ( user )
            {
                onRegister( user );
            }
        }
    }

    return (
        <Dialog open={opened} fullWidth>
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
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                {noCancel === false && <Button onClick={onCancel} fullWidth>Abbrechen</Button>}
            </DialogActions>
        </Dialog>
    );
} );