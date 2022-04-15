import { useMemo } from "react";
import UserManagementService from "../../services/userManagementService";

export const useUserManagementService = ( token?: string ) =>
{
    return useMemo( () => new UserManagementService( token ), [ token ] );
}