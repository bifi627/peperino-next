import cookie from "js-cookie";
import { AUTH_TOKEN_COOKIE_NAME } from "../shared/constants";
import { ApiHelper, Endpoint, RequestMethod } from "./apiConfig";

export class BaseService
{
    public readonly endpoint?: Endpoint;

    private static _token?: string;
    public static set token( token: string )
    {
        this._token = token;
    }

    protected getRoute()
    {
        if ( !this.endpoint )
        {
            throw new Error( "Endpoint not set" );
        }

        return ApiHelper.getEndpointRoute( this.endpoint );
    }

    protected async get<IN, OUT>( path?: string, body?: IN )
    {
        const request = this.createRequestOptions( "GET", JSON.stringify( body ) );

        const url = path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.table( { url: url, param: body } );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected async post<IN, OUT>( path?: string, body?: IN )
    {
        const request = this.createRequestOptions( "POST", JSON.stringify( body ) );

        const url = path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.log( "[POST] " + url );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected createRequestOptions( method: RequestMethod, body: string | object )
    {
        if ( typeof body === "object" )
        {
            body = JSON.stringify( body );
        }

        const token = BaseService._token ?? cookie.get( AUTH_TOKEN_COOKIE_NAME );

        const options = {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: body,
        } as RequestInit;

        return options;
    }

    protected async handleResponse<T>( response: Response )
    {
        if ( response.ok && response.body )
        {
            const user = await response.json() as T;
            return user;
        }
        else if ( response.type === "error" )
        {
            throw new Error( await response.json() )
        }
        else
        {
            console.error( response );
            throw new Error( "Error processing response" );
        }
    }
}
