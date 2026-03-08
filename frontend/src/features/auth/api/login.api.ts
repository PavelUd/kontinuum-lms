import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";

type LoginRequest = {
    login: string
    password: string
}

export async function login(data: LoginRequest): Promise<ApiResponse<string>> {
    return await api.post<ApiResponse<string>>(`/auth/login`, data);
}