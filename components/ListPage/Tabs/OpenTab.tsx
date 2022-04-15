import { Center, Space, TextInput, useMantineTheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Plus } from "tabler-icons-react";
import { useListState } from "../../../hooks/state/useListState";
import { SortableListItem } from "../../Sortables";
import { CheckableItem } from "../CheckList/CheckItem";
import { SortableCheckList } from "../CheckList/SortableCheckList";
import { IconButton, ScrollBox } from "../_styles";

interface Props
{
}

export const OpenTab = observer( ( props: Props ) =>
{
    const viewModel = useListState();
    const theme = useMantineTheme();

    const notifications = useNotifications();
    const router = useRouter();

    const scrollRef = useRef<HTMLDivElement>( null );
    const inputRef = useRef<HTMLInputElement>( null );

    const onSubmitAddItem = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        e.stopPropagation();

        const currentInputValue = inputRef.current?.value ?? "";

        if ( currentInputValue !== "" )
        {
            try
            {
                await viewModel.addItem( currentInputValue );

                resetInput();
                scrollToBottom();
            }
            catch ( error: any )
            {
                notifications.showNotification( {
                    title: "Fehler", message: error.message, color: "red", autoClose: false, onClose: () =>
                    {
                        router.reload();
                    }
                } );
            }
        }
    };

    const resetInput = () =>
    {
        if ( inputRef.current )
        {
            inputRef.current.value = "";
        }
    };

    const scrollToBottom = () => 
    {
        if ( scrollRef.current )
        {
            console.log( scrollRef.current.scrollHeight );
            scrollRef.current.scrollTo( { top: scrollRef.current.scrollHeight, behavior: 'smooth' } );
        }
    };

    return (
        <>
            <ScrollBox ref={scrollRef}>
                <SortableCheckList>
                    {viewModel.uncheckedItems.map( ( item, index ) =>
                    {
                        return (
                            <SortableListItem showDragHandle key={item.id} index={index}>
                                <CheckableItem model={item} onDelete={() => viewModel.deleteItem( item )} onUpdate={() => viewModel.updateItem( item )} pressDelay={3000}></CheckableItem>
                            </SortableListItem>
                        );
                    } )}
                </SortableCheckList>
            </ScrollBox>
            <Space h={"xl"}></Space>
            <form style={{ display: "grid", gridTemplateColumns: "1fr 45px", gap: "10px" }} onSubmit={onSubmitAddItem}>
                <TextInput autoComplete="false" ref={inputRef} required autoFocus />
                <IconButton radius={40} color={theme.white} background={theme.colors.blue[ 6 ]} type="submit">
                    <Center>
                        <Plus></Plus>
                    </Center>
                </IconButton>
            </form>
        </>
    );
} );