import { Button, Group, Modal, PasswordInput, Space, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import React from "react";
import { KnownRoutes } from "../../lib/routing";
import UserService from "../../services/userService";

interface Props
{
}

let usernameNotAvailable = false;
export default ( { }: Props ) =>
{
    const router = useRouter();
    const theme = useMantineTheme();
    const notifications = useNotifications();
    const userService = new UserService();

    const form = useForm( {
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

        const result = form.validate();

        if ( result.hasErrors === false )
        {
            try
            {
                if ( !await userService.checkUsername( form.values.username ) )
                {
                    usernameNotAvailable = true;
                    throw new Error( "Benutzername nicht verfügbar!" );
                }
                const newUser = await userService.createNewUser( form.values.username, form.values.email, form.values.password );

                if ( newUser )
                {
                    router.push( KnownRoutes.Login( form.values.email ) );
                }
            }
            catch ( error: any )
            {
                notifications.showNotification( { title: "Fehler", message: error.message, color: "red" } );
                form.validateField( "username" );
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
                    {...form.getInputProps( "email" )} />
                <Space h="md" />
                <PasswordInput
                    required
                    label="Passwort"
                    placeholder="Passwort"
                    type="password"
                    {...form.getInputProps( "password" )} />
                <Space h="md" />
                <PasswordInput
                    required
                    label="Passwort"
                    placeholder="Passwort wiederholen"
                    type="password"
                    {...form.getInputProps( "password2" )} />
                <Space h="md" />
                <TextInput
                    required
                    label="Name"
                    placeholder="Benutzername"
                    {...form.getInputProps( "username" )} />
                <Space h="xl" />
                <Group position="center">
                    <Button type="submit">Registrieren</Button>
                </Group>
            </form>
        </Modal>
    );
}