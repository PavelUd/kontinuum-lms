import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";

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

export async function activateLink({token, password} : {token : string, password: string}) : Promise<ApiResponse<string>> {
    return await api.post<ApiResponse<string>>(`/auth/link/${token}/activate`, {password : password});
}