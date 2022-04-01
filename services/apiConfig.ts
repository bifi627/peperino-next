import { BACKEND_URL } from "../shared/constants";

export type Endpoint = "user" | "list" | "config";

export type Hub = "notification";

export type RequestMethod = "POST" | "GET" | "PUT" | "DELETE";

export module ApiHelper
{
    export const getBaseRoute = () =>
    {
        return BACKEND_URL as string;
    }

    export const getEndpointRoute = ( endpoint: Endpoint ) =>
    {
        return getBaseRoute() + "api/v1/" + endpoint;
    }

    export const getHubRoute = ( hub: Hub ) =>
    {
        return getBaseRoute() + hub;
    }
}