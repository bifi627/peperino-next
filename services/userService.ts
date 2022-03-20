import { User } from "../models/user";
import { Endpoint } from "./apiConfig";
import { BaseService } from "./baseService";

export default class UserService extends BaseService
{
    public override readonly endpoint?: Endpoint = "user";

    constructor()
    {
        super();
    }

    public async createNewUser( username: string, externalId: string )
    {
        var user: User = { username: username, externalId: externalId };

        user = await this.post<User, User>( "", user );

        return user;
    }

    public async getCurrentUser()
    {
        return await this.get<undefined, User>( "" );
    }
}