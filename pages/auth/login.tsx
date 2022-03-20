import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import LoginDialog from "../../components/Login/LoginDialog";

interface Props
{
    value: string;
}

const Box = styled.div`
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;

    margin-top: -40%;
`;

export default observer( ( props: Props ) =>
{
    const router = useRouter();
    const redirect = router.query[ "redirect" ] as string;

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

    return (
        <LoginDialog opened onCancel={moveBack} onRegister={moveBack} onLogin={moveBack} />
    );
} );
