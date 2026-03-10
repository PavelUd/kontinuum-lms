import { useQuery } from '@tanstack/react-query'
import {ApiResponse} from "@/shared/api/types/api-response";
import { User } from "./types";
import {getProfile} from "@/entities/user/api/auth.api";
import {getToken} from "@/shared/lib/auth/tokenStorage";


export const useProfileQuery = () => {

    const token = getToken()

    return useQuery<ApiResponse<User>>({
        queryKey: ['profile'],
        queryFn: getProfile,
        enabled: !!token
    })
}