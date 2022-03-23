import { Text } from "@mantine/core";
import styled from "styled-components";

interface Props
{
}

const ProfilePicture = styled.div<{ url: string }>`
    border-radius: 20px;
    height: 32px;
    width: 32px;
    background: url(${p => p.url});
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
    return (
        <ProfileBox>
            <ProfilePicture url={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}></ProfilePicture>
            <Text>Einloggen</Text>
        </ProfileBox>
    );
}
