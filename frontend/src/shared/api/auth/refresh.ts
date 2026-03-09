import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";

export async function refresh(): Promise<ApiResponse<string>> {
    return await api.post<ApiResponse<string>>(`/auth/refresh`);
}