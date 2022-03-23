import { Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import useUser from "../../../hooks/useUser";
import { KnownRoutes } from "../../../lib/routing";

interface Props
{
}

const ProfilePicture = styled.img`
    border-radius: 20px;
    height: 32px;
    width: 32px;
    background-size: cover;
    `;

const ProfileBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    user-select: none;
`;

export default ( props: Props ) =>
{
    const user = useUser();
    const router = useRouter();

    const onProfileClick = () =>
    {
        if ( user && user.peperinoUser?.username )
        {
            router.push( KnownRoutes.Profile( user.peperinoUser.username ) );
        }
    }

    const ref = useRef<HTMLImageElement>( null );

    useLayoutEffect( () =>
    {
        if ( ref.current )
        {
            if ( user && user.firebaseUser.photoURL )
            {
                ref.current.src = user.firebaseUser.photoURL;
            }
            else
            {
                ref.current.referrerPolicy = "no-referrer";
                ref.current.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
        }
    }, [ ref, user ] );

    return (
        <ProfileBox onClick={onProfileClick}>
            <ProfilePicture ref={ref}></ProfilePicture>
            <Text>{user?.firebaseUser.email}</Text>
        </ProfileBox>
    );
}
