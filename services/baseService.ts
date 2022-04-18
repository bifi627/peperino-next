import cookie from "js-cookie";
import { AUTH_TOKEN_COOKIE_NAME } from "../shared/constants";
import { NetworkError } from "../shared/networkError";
import { ApiHelper, Endpoint, RequestMethod } from "./apiConfig";

export class BaseService
{
    public readonly endpoint?: Endpoint;

    private _token?: string;

    protected constructor( token?: string )
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

    protected async post<IN, OUT>( path?: string, body?: IN )
    {
        const request = this.createRequestOptions( "POST", JSON.stringify( body ) );

        const url = path && path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.table( { url: url, body: body } );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected async put<IN, OUT>( path?: string, body?: IN )
    {
        const request = this.createRequestOptions( "PUT", JSON.stringify( body ) );

        const url = path && path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.table( { url: url, body: body } );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected async get<OUT>( path?: string )
    {
        const request = this.createRequestOptions( "GET" );

        const url = path && path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.log( "[GET] " + url );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected async delete<OUT>( path?: string )
    {
        const request = this.createRequestOptions( "DELETE" );

        const url = path && path !== "" ? `${this.getRoute()}/${path}` : this.getRoute();

        console.log( "[DELETE] " + url );

        const response = await fetch( url, request );
        return this.handleResponse<OUT>( response );
    }

    protected createRequestOptions( method: RequestMethod, body?: string | object )
    {
        if ( typeof body === "object" )
        {
            body = JSON.stringify( body );
        }

        const token = this._token ?? cookie.get( AUTH_TOKEN_COOKIE_NAME );

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
        if ( response.ok )
        {
            if ( response.body )
            {
                const responseText = await response.text();
                try
                {
                    const obj = JSON.parse( responseText ) as T;
                    return obj;
                }
                catch
                {
                    return responseText as unknown as T;
                }
            }
            else
            {
                return undefined as unknown as T;
            }
        }
        else if ( response.type === "error" || response.type === "cors" )
        {
            const error = await response.text();
            console.error( error );
            throw new Error( error )
        }
        else
        {
            const error = await response.text();
            console.error( error );
            throw new NetworkError( response );
        }
    }
}

