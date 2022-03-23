import Link from "next/link";
import useFirebaseUser from "../hooks/useUser";
import { KnownRoutes } from "../lib/routing";

interface Props
{
    children?: JSX.Element;
    fallback?: JSX.Element;
    hidden?: boolean;
}

export default ( props: Props ): JSX.Element =>
{
    const user = useFirebaseUser();

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