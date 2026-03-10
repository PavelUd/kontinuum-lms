import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {getToken} from "@/shared/lib/auth/tokenStorage";

type LoginRequest = {
    login: string
    password: string
}

export async function login(data: LoginRequest): Promise<ApiResponse<string>> {
    return await api.post<ApiResponse<string>>(`/auth/login`, data);
}

export async function logout(): Promise<void> {
    return await api.post<void>(`/auth/logout`,{}, { auth: true });
}