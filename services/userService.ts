import { CreateUserRequest, User } from "../interfaces/user";
import { Endpoint } from "./apiConfig";
import { BaseService } from "./baseService";

export default class UserService extends BaseService
{
    public override readonly endpoint?: Endpoint = "user";

    constructor()
    {
        super();
    }

    public async createNewUser( username: string, email: string, password: string )
    {
        return this.post<CreateUserRequest, User>( "", {
            user: {
                username: username,
                externalId: "some",
            },
            email: email,
            password: password,
        } );
    }

    public async getCurrentUser()
    {
        return this.get<User>( "" );
    }

    public async getUserByUsername( username: string )
    {
        return this.get<User>( `data/${username}` );
    }

    public async checkUsername( username: string )
    {
        return this.post<string, boolean>( "check", username );
    }

    public async handleProviderLogin( user: User )
    {
        return this.post<User, User>( "provider", user );
    }

    public async deleteUser( user: User )
    {
        return this.delete<void>( user.externalId );
    }
}