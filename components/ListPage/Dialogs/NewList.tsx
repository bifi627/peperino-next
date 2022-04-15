import { Button, Group, Modal, Space, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { List } from "../../../lib/interfaces/list";

interface Props
{
    onCreate: ( list: List ) => void;
    onClose: () => void;
}

export const NewList = ( { onCreate, onClose }: Props ) =>
{
    const theme = useMantineTheme();

    const form = useForm( {
        initialValues: {
            name: "",
        },
        validate: {
            name: ( value ) => value.length < 3 ? "Name muss mindestens 3 Zeichen lang sein" : null,
        },
    } );

    const onSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        if ( !form.validate().hasErrors )
        {
            onCreate( { name: form.values.name, listItems: [], slug: "" } );
        }
    }

    return (
        <Modal
            title={"Neue Liste"}
            centered
            opened
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[ 9 ] : theme.colors.gray[ 2 ]}
            overlayOpacity={0.7}
            onClose={onClose}>
            <form onSubmit={onSubmit}>
                <TextInput
                    required
                    autoFocus
                    label="Titel"
                    placeholder="Titel"
                    type="text"
                    {...form.getInputProps( "name" )} />
                <Space h="xl"></Space>
                <Group position="center">
                    <Button type="submit">Neue Liste erstellen</Button>
                </Group>
            </form>
        </Modal>
    );
}