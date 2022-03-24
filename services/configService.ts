import { Endpoint } from "./apiConfig";
import { BaseService } from "./baseService";

export default class ConfigService extends BaseService
{
    public override readonly endpoint?: Endpoint = "config";

    constructor( token?: string )
    {
        super( token );
    }

    public check()
    {
        return this.get<boolean>();
    }
}