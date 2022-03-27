import React, { useCallback, useRef, useState } from "react";

// https://stackoverflow.com/a/48057286/16191748

const useLongPress = (
    onLongPress: ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) => void,
    onClick: ( e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement> ) => void,
    { shouldPreventDefault = true, delay = 300 } = {}
) =>
{
    const [ longPressTriggered, setLongPressTriggered ] = useState( false );
    const timeout = useRef<NodeJS.Timeout>();
    const target = useRef();

    const start = useCallback(
        ( event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> ) =>
        {
            if ( shouldPreventDefault && event.target )
            {
                ( event.target as any ).addEventListener( "touchend", preventDefault, {
                    passive: false,
                } );
                ( target.current as any ) = event.target;
            }
            timeout.current = setTimeout( () =>
            {
                onLongPress( event );
                setLongPressTriggered( true );
            }, delay );
        },
        [ onLongPress, delay, shouldPreventDefault ]
    );

    const clear = useCallback(
        ( event, shouldTriggerClick = true ) =>
        {
            timeout.current && clearTimeout( timeout.current );
            shouldTriggerClick && !longPressTriggered && onClick( event );
            setLongPressTriggered( false );
            if ( shouldPreventDefault && target.current )
            {
                ( target.current as any ).removeEventListener( "touchend", preventDefault );
            }
        },
        [ shouldPreventDefault, onClick, longPressTriggered ]
    );

    return {
        onMouseDown: ( e: React.MouseEvent<HTMLElement> ) => start( e ),
        onTouchStart: ( e: React.TouchEvent<HTMLElement> ) => start( e ),
        onMouseUp: ( e: React.MouseEvent<HTMLElement> ) => clear( e ),
        onMouseLeave: ( e: React.MouseEvent<HTMLElement> ) => clear( e, false ),
        onTouchEnd: ( e: React.TouchEvent<HTMLElement> ) => clear( e )
    };
};

const isTouchEvent = ( event: any ) =>
{
    return "touches" in event;
};

const preventDefault = ( event: any ) =>
{
    if ( !isTouchEvent( event ) ) return;

    if ( event.touches.length < 2 && event.preventDefault )
    {
        event.preventDefault();
    }
};

export default useLongPress;