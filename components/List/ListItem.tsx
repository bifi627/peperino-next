import { Center, Checkbox, Group, Text, TextInput, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { Check, Loader, QuestionMark, Settings, Trash, X } from "tabler-icons-react";
import useLongPress from "../../hooks/useLongPress";
import { ListItem } from "../../lib/interfaces/list";

export interface ListItemProps
{
    item: ListItem;
    onUpdate: ( item: ListItem ) => void;
    onDelete: ( item: ListItem ) => void;
    pressTimeout?: number;
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

export default ( { item, onUpdate, onDelete, pressTimeout }: ListItemProps ) =>
{
    const theme = useMantineTheme();

    const [ indeterminate, setIndeterminate ] = useState( false );
    const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout>();
    const [ innerText, setInnerText ] = useState( item.text );

    const longDebounceDispatch = () =>
    {
        // If pending change, cancel
        if ( timeoutId )
        {
            clearTimeout( timeoutId );
            setTimeoutId( undefined );
            setIndeterminate( false );
        }
        else
        {
            // Queue change
            setTimeoutId( setTimeout( async () =>
            {
                item.checked = !item.checked;
                onUpdate( item );
            }, pressTimeout ?? 73 ) );
            setIndeterminate( true );
        }
    }

    const onToggleEdit = () =>
    {
        setEditMode( e => !e );
        setInnerText( item.text );

        if ( confirmDelete === true )
        {
            setConfirmDelete( false );
        }
    }

    const onClick = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        !editMode && longDebounceDispatch();
    }
    const [ editMode, setEditMode ] = useState( false );

    const [ confirmDelete, setConfirmDelete ] = useState( false );

    const o = useLongPress( e =>
    {
        setEditMode( true );
    }, e => { } );

    return (
        <>
            <Box key={item.id}>
                {editMode ?
                    <Group sx={{ width: "100%", flexWrap: "nowrap" }} direction="row">
                        <TextInput sx={{ width: "100%" }} autoFocus value={innerText} size="xs" onChange={e => setInnerText( e.currentTarget.value )}></TextInput>
                        <IconButton radius={20} color={theme.white} background={theme.colors.green[ 6 ]} onClick={() => { setEditMode( false ); onUpdate( { ...item, text: innerText } ) }}>
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
                                onDelete( item );
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
                        onClick={onClick}
                        icon={( { indeterminate, className } ) => indeterminate ? <Loader className={className} /> : <Check className={className} />}
                        style={{ maxWidth: "90vw", overflow: "hidden", userSelect: "none", width: "100%" }}
                        indeterminate={!!pressTimeout && indeterminate}
                        size="md"
                        checked={item.checked}
                        onChange={e => e}
                        label={<Text underline={editMode}>{item.text}</Text>}
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
