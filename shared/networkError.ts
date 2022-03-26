type CustomErrorType = "NetworkError";

export class NetworkError extends Error
{
    private type: CustomErrorType = "NetworkError";

    public readonly response: Response;

    constructor( response: Response )
    {
        super( response.statusText );
        this.response = response;
    }

    public static isNetworkError( error: any ): error is NetworkError
    {
        if ( error !== undefined && ( error as unknown as NetworkError ).type === "NetworkError" )
        {
            return true;
        }

        return false;
    }
}