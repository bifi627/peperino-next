import { Button, Checkbox, Group, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { Check, Loader, Trash } from "tabler-icons-react";
import useLongPress from "../../hooks/useLongPress";
import { ListItem } from "../../lib/interfaces/list";

interface Props
{
    item: ListItem;
    onUpdate: ( item: ListItem ) => void;
    pressTimeout?: number;
    onDelete: ( item: ListItem ) => void;
    skipEvents?: boolean;
}

const Box = styled.div`
    width: 100%;
`;

export default ( { item, pressTimeout, onUpdate, onDelete, skipEvents }: Props ) =>
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
            }, pressTimeout ?? 72 ) );
            setIndeterminate( true );
        }
    }

    const onLongPress = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        !skipEvents && setEditMode( true );
    };

    const onClick = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        !editMode && !skipEvents && longDebounceDispatch();
    }
    const [ editMode, setEditMode ] = useState( false );

    const defaultOptions = {
        shouldPreventDefault: !editMode,
        delay: 500,
    };
    const longPressEvent = useLongPress( onLongPress, onClick, defaultOptions );

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Box {...longPressEvent} key={item.id}>
                {editMode ?
                    <Group direction="row">
                        <TextInput style={{ width: "calc(100% - 200px)" }} autoFocus value={innerText} onChange={e => setInnerText( e.currentTarget.value )}></TextInput>
                        <Button variant="light" leftIcon={<Check />} size="xs" type="button" onClick={() => { setEditMode( false ); onUpdate( { ...item, text: innerText } ) }}></Button>
                        <Button variant="light" leftIcon={<Trash />} size="xs" type="button" onClick={() => { setEditMode( false ); onDelete( item ); }}></Button>
                    </Group>
                    :
                    <Checkbox
                        icon={( { indeterminate, className } ) => indeterminate ? <Loader className={className} /> : <Check className={className} />}
                        style={{ maxWidth: "90vw", overflow: "hidden", userSelect: "none" }}
                        indeterminate={!!pressTimeout && indeterminate}
                        size="md"
                        checked={item.checked}
                        onChange={e => e}
                        label={<Text underline={editMode}>{item.text}</Text>}
                    />}
            </Box>
        </div>
    );
}
