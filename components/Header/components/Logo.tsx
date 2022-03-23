import { useRouter } from "next/router";
import styled from "styled-components";
import { KnownRoutes } from "../../../lib/routing";

interface Props
{
}

const LogoPicture = styled.div<{ url: string }>`
    border-radius: 20px;
    height: 32px;
    width: 32px;
    background: url(${p => p.url});
    background-size: cover;
`;

const LogoBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    user-select: none;
`;

export default ( props: Props ) =>
{
    const router = useRouter();

    const onLogoClick = () =>
    {
        router.push( KnownRoutes.Root() )
    }

    return (
        <LogoBox onClick={onLogoClick}>
            <LogoPicture url={"https://upload.wikimedia.org/wikipedia/commons/7/78/Hk_P-plate.svg"}></LogoPicture>
            <span>Peperino</span>
        </LogoBox>
    );
}