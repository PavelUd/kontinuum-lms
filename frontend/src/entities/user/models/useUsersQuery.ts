import { useQuery } from '@tanstack/react-query'
import {ApiResponse} from "@/shared/api/types/api-response";
import { User } from "./types";
import {getProfile} from "@/entities/user/api/auth.api";


export const useProfileQuery = () => {
    return useQuery<ApiResponse<User>>({
        queryKey: ["auth"],
        queryFn: getProfile,
    })
}