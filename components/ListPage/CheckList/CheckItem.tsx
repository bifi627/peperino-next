import { Center, Checkbox, Group, Text, TextInput, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { Check, Loader, QuestionMark, Settings, Trash, X } from "tabler-icons-react";
import { useDebouncedCallback } from "use-debounce";
import { ListItem } from "../../../lib/interfaces/list";

export interface ListItemProps
{
    model: ListItem;
    onUpdate: ( item: ListItem ) => void;
    onDelete: ( item: ListItem ) => void;
    pressDelay?: number;
}

const Box = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export const IconButton = styled( UnstyledButton ) <{ color: string, background: string, radius?: number }>`
    padding: 5px;
    border-radius: 20px;
    color: ${p => p.color};
    background: ${p => p.background};
`;

export const CheckableItem = ( { model, onUpdate, onDelete, pressDelay }: ListItemProps ) =>
{
    const theme = useMantineTheme();

    const [ indeterminate, setIndeterminate ] = useState( false );
    const [ innerText, setInnerText ] = useState( model.text );
    const [ editMode, setEditMode ] = useState( false );
    const [ confirmDelete, setConfirmDelete ] = useState( false );

    const debounceUpdate = useDebouncedCallback( () =>
    {
        model.checked = !model.checked;
        onUpdate( model );
    }, pressDelay ?? 73 );

    const onToggleEdit = () =>
    {
        setEditMode( e => !e );
        setInnerText( model.text );

        if ( confirmDelete === true )
        {
            setConfirmDelete( false );
        }
    }

    const onCheck = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        if ( debounceUpdate.isPending() === false )
        {
            setIndeterminate( true );
            !editMode && debounceUpdate();
        }
        else
        {
            setIndeterminate( false );
            debounceUpdate.cancel();
        }
    }

    return (
        <>
            <Box>
                {editMode ?
                    <Group sx={{ width: "100%", flexWrap: "nowrap" }} direction="row">
                        <TextInput sx={{ width: "100%" }} autoFocus value={innerText} size="xs" onChange={e => setInnerText( e.currentTarget.value )}></TextInput>
                        <IconButton radius={20} color={theme.white} background={theme.colors.green[ 6 ]} onClick={() => { setEditMode( false ); onUpdate( { ...model, text: innerText } ) }}>
                            <Center>
                                <Check />
                            </Center>
                        </IconButton>
                        <IconButton radius={20} color={theme.white} background={theme.colors.red[ 6 ]} onClick={() =>
                        {
                            if ( confirmDelete === true )
                            {
                                setEditMode( false );
                                setConfirmDelete( false );
                                onDelete( model );
                            }
                            else
                            {
                                setConfirmDelete( true );
                            }
                        }}>
                            <Center>
                                {confirmDelete ? <QuestionMark /> : <Trash />}
                            </Center>
                        </IconButton>
                    </Group>
                    :
                    <Checkbox
                        onClick={onCheck}
                        icon={( { indeterminate, className } ) => indeterminate ? <Loader className={className} /> : <Check className={className} />}
                        style={{ maxWidth: "90vw", overflow: "hidden", userSelect: "none", width: "100%" }}
                        indeterminate={indeterminate}
                        size="md"
                        checked={model.checked}
                        onChange={e => e}
                        label={<Text>{model.text}</Text>}
                    />}
            </Box>
            <IconButton radius={20} color={theme.white} background={theme.colors.blue[ 6 ]} onClick={onToggleEdit}>
                <Center>
                    {editMode ? <X /> : <Settings />}
                </Center>
            </IconButton>
        </>
    );
}
