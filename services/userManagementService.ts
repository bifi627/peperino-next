import { AuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { CreateUserRequest, User } from "../lib/interfaces/user";
import { Endpoint } from "./apiConfig";
import { BaseService } from "./baseService";

export default class UserManagementService extends BaseService
{
    public readonly firebaseConnector = {
        signInWithEmailAndPassword: async ( email: string, password: string ) =>
        {
            return await signInWithEmailAndPassword( getAuth(), email, password );
        },
        signInWithPopup: async ( provider: AuthProvider ) =>
        {
            return await signInWithPopup( getAuth(), provider );
        }
    }

    public override readonly endpoint?: Endpoint = "userManagement";

    constructor( token?: string )
    {
        super( token );
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
