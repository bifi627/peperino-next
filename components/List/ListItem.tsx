import { Button, Checkbox, Group, Popover, Text } from "@mantine/core";
import { useState } from "react";
import styled from "styled-components";
import { Check, Loader, Trash } from "tabler-icons-react";
import useLongPress from "../../hooks/useLongPress";
import { ListItem } from "../../lib/interfaces/list";

interface Props
{
    item: ListItem;
    onPress: ( item: ListItem ) => void;
    pressTimeout?: number;
    onDelete: ( item: ListItem ) => void;
}

const Box = styled.div`
    width: 100%;
`;

export default ( { item, pressTimeout, onPress, onDelete }: Props ) =>
{
    const [ indeterminate, setIndeterminate ] = useState( false );
    const [ timeoutId, setTimeoutId ] = useState<NodeJS.Timeout>();

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
                onPress( item );
            }, pressTimeout ?? 72 ) );
            setIndeterminate( true );
        }
    }

    const onLongPress = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        setPopupOpened( true );
    };

    const onClick = ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) =>
    {
        !popupOpened && longDebounceDispatch();
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };
    const longPressEvent = useLongPress( onLongPress, onClick, defaultOptions );

    const [ popupOpened, setPopupOpened ] = useState( false );

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Box {...longPressEvent} key={item.id}>
                <Checkbox
                    icon={( { indeterminate, className } ) => indeterminate ? <Loader className={className} /> : <Check className={className} />}
                    style={{ maxWidth: "90vw", overflow: "hidden", userSelect: "none" }}
                    indeterminate={!!pressTimeout && indeterminate}
                    size="md"
                    checked={item.checked}
                    onChange={e => e}
                    label={<Text underline={popupOpened}>{item.text}</Text>}
                />
            </Box>
            <Popover
                radius={20}
                opened={popupOpened}
                onClose={() => setPopupOpened( false )}
                position="bottom"
                target={
                    <></>
                }            >
                <Group direction="column">
                    <Button variant="light" leftIcon={<Trash />} fullWidth size="xs" color="red" type="button" onClick={() => { setPopupOpened( false ); onDelete( item ); }}></Button>
                    <Button variant="light" fullWidth size="xs" type="button" onClick={() => setPopupOpened( false )}>Abbrechen</Button>
                </Group>
            </Popover>
        </div>
    );
}
