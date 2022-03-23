export interface User
{
    username: string;
    externalId: string;
}

export interface CreateUserRequest
{
    user: User;
    password: string;
    email: string;
}
