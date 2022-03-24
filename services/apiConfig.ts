import { BACKEND_URL } from "../shared/constants";

export type Endpoint = "user" | "list" | "config";

export type RequestMethod = "POST" | "GET" | "PUT" | "DELETE";

export module ApiHelper
{
    export const getBaseRoute = () =>
    {
        return BACKEND_URL as string;
    }

    export const getEndpointRoute = ( endpoint: Endpoint ) =>
    {
        return getBaseRoute() + endpoint;
    }
}