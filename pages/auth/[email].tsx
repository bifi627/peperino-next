import { Button, Group, Modal, PasswordInput, Space, Text, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BrandGoogle } from 'tabler-icons-react';
import UserService from "../../services/userService";
import { KnownRoutes } from "../../shared/knownRoutes";

interface Props
{
}

export default ( props: Props ) =>
{
    const router = useRouter();
    const notifications = useNotifications();

    const email = router.query[ "email" ] as string;
    const redirect = router.query[ "redirect" ] as string;

    const form = useForm( {
        initialValues: {
            email: email,
            password: "",
        },
    } );

    useEffect( () =>
    {
        form.setFieldValue( "email", email );
    }, [ email ] )

    const moveBack = () =>
    {
        if ( router )
        {
            if ( redirect )
            {
                // TODO: Wait for cookie...
                setTimeout( () =>
                {
                    router.replace( redirect );
                }, 300 );
            }
            else
            {
                router.back();
            }
        }
    }

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        const result = form.validate();

        if ( result.hasErrors === false )
        {
            try
            {
                await signInWithEmailAndPassword( getAuth(), form.values.email, form.values.password );
                moveBack();
            }
            catch ( error: any )
            {
                notifications.showNotification( { title: "Fehler", message: error.message, color: "red", autoClose: false } );
            }
        }
    };

    const onGoogleLogin = async () =>
    {
        try
        {
            const result = await signInWithPopup( getAuth(), new GoogleAuthProvider() );
            const user = await new UserService().handleProviderLogin( { username: result.user.email ?? "???", externalId: result.user.uid } );
            if ( user )
            {
                moveBack();
            }
        }
        catch ( error: any )
        {
            notifications.showNotification( { title: "Fehler", message: error.message, color: "red", autoClose: false } );
        }
    }

    const theme = useMantineTheme();
    return (
        <Modal
            title={"Mit Account einloggen"}
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
                <Space h="xl" />
                <Group position="center">
                    <Button fullWidth type="submit">Einloggen</Button>
                </Group>
                <Space h="xl" />
                <Group position="apart">
                    <Link href={KnownRoutes.Register()} passHref>
                        <Text component="a" size="sm" underline>Neuen Account erstellen</Text>
                    </Link>
                    <Button onClick={onGoogleLogin} leftIcon={<BrandGoogle></BrandGoogle>}>Google</Button>
                </Group>
            </form>
        </Modal >
    );
}