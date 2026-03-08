import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {User} from "@/entities/user/models/types";

export const getProfile = async (): Promise<ApiResponse<User>> => {
    return api.get<ApiResponse<User>>('/auth/profile', {
        auth: true
    })
}