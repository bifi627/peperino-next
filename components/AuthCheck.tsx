import Link from "next/link";
import { useUser } from "../hooks/useUser";
import { KnownRoutes } from "../shared/knownRoutes";

interface Props
{
    children?: JSX.Element;
    fallback?: JSX.Element;
    hidden?: boolean;
}

export const AuthCheck = ( props: Props ): JSX.Element =>
{
    const user = useUser();

    if ( user )
    {
        return props.children ?? <></>;
    }

    if ( props.fallback )
    {
        return props.fallback;
    }

    if ( props.hidden )
    {
        return <></>;
    }

    return <Link href={KnownRoutes.Login()}>You must be signed in</Link>;
}