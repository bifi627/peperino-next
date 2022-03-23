import { Text } from "@mantine/core";
import styled from "styled-components";
import useUser from "../../../hooks/useUser";

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

    return (
        <ProfileBox>
            <ProfilePicture referrerPolicy="no-referrer" src={user?.firebaseUser?.photoURL ? user.firebaseUser.photoURL : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}></ProfilePicture>
            <Text>{user?.firebaseUser.email}</Text>
        </ProfileBox>
    );
}
