import { useMemo } from "react";
import ListService from "../../services/listService";

export const useListService = ( token?: string ) =>
{
    return useMemo( () => new ListService( token ), [ token ] );
}