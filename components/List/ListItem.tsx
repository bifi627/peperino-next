import { Button, Checkbox, Group, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { Check, Loader, Settings, Trash, X } from "tabler-icons-react";
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
`;

export default ( { item, onUpdate, onDelete, pressTimeout }: ListItemProps ) =>
{
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
    }

    const onClick = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        !editMode && longDebounceDispatch();
    }
    const [ editMode, setEditMode ] = useState( false );

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Box onClick={onClick} key={item.id}>
                {editMode ?
                    <Group direction="row">
                        <TextInput style={{ width: "calc(100% - 200px)" }} autoFocus value={innerText} size="xs" onChange={e => setInnerText( e.currentTarget.value )}></TextInput>
                        <Button variant="light" leftIcon={<Check />} size="xs" type="button" onClick={() => { setEditMode( false ); onUpdate( { ...item, text: innerText } ) }}></Button>
                        <Button variant="light" leftIcon={<Trash />} size="xs" type="button" onClick={() => { setEditMode( false ); onDelete( item ); }}></Button>
                    </Group>
                    :
                    <Checkbox
                        icon={( { indeterminate, className } ) => indeterminate ? <Loader className={className} /> : <Check className={className} />}
                        style={{ maxWidth: "90vw", overflow: "hidden", userSelect: "none", width: "100%" }}
                        indeterminate={!!pressTimeout && indeterminate}
                        size="md"
                        checked={item.checked}
                        onChange={e => e}
                        label={<Text underline={editMode}>{item.text}</Text>}
                    />}
            </Box>
            <Button size="xs" variant="light" onClick={onToggleEdit} leftIcon={editMode ? <X /> : <Settings />}></Button>
        </div>
    );
}
