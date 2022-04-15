import { Button, Group, Modal, PasswordInput, Space, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import React from "react";
import { useUserManagementService } from "../../hooks/services/useUserManagementService";
import { KnownRoutes } from "../../shared/knownRoutes";

interface Props
{
}

let usernameNotAvailable = false;

const RegisterPage = ( props: Props ) =>
{
    const router = useRouter();
    const theme = useMantineTheme();
    const notifications = useNotifications();

    const userManagementService = useUserManagementService();

    const registerForm = useForm( {
        initialValues: {
            email: "",
            password: "",
            password2: "",
            username: "",
        },

        validate: {
            email: ( value ) => ( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( value ) ? null : "Email ungültig" ),
            password: ( value ) => value.length < 6 ? "Passwort muss mindestens 7 Zeichen lang sein" : null,
            password2: ( value, { password } ) => value !== password ? "Passwort muss identisch sein" : null,
            username: ( value ) => value.length < 3 ? "Benutzername muss mindestens 3 Zeichen lang sein" : usernameNotAvailable ? "Benutzername ist nicht verfügbar" : null,
        },
    } );

    const moveBack = () =>
    {
        router.back();
    };

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        usernameNotAvailable = false;

        const result = registerForm.validate();

        if ( result.hasErrors === false )
        {
            try
            {
                const usernameAvailable = await userManagementService.checkUsername( registerForm.values.username );
                if ( !usernameAvailable )
                {
                    usernameNotAvailable = true;
                    throw new Error( "Benutzername nicht verfügbar!" );
                }

                const newUser = await userManagementService.createNewUser( registerForm.values.username, registerForm.values.email, registerForm.values.password );

                if ( newUser )
                {
                    router.push( KnownRoutes.Login( registerForm.values.email ) );
                }
            }
            catch ( error: any )
            {
                notifications.showNotification( { title: "Fehler", message: error.message, color: "red" } );
                registerForm.validateField( "username" );
            }
        }
    };

    return (
        <Modal
            title={"Registrieren"}
            centered
            opened
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[ 9 ] : theme.colors.gray[ 2 ]}
            overlayOpacity={0.7}
            onClose={moveBack}>
            <form onSubmit={onSubmit}>
                <TextInput
                    required
                    autoFocus
                    label="Email"
                    placeholder="Email"
                    type="email"
                    {...registerForm.getInputProps( "email" )} />
                <Space h="md" />
                <PasswordInput
                    required
                    label="Passwort"
                    placeholder="Passwort"
                    type="password"
                    {...registerForm.getInputProps( "password" )} />
                <Space h="md" />
                <PasswordInput
                    required
                    label="Passwort"
                    placeholder="Passwort wiederholen"
                    type="password"
                    {...registerForm.getInputProps( "password2" )} />
                <Space h="md" />
                <TextInput
                    required
                    label="Name"
                    placeholder="Benutzername"
                    {...registerForm.getInputProps( "username" )} />
                <Space h="xl" />
                <Group position="center">
                    <Button type="submit">Registrieren</Button>
                </Group>
            </form>
        </Modal>
    );
}

export default RegisterPage;