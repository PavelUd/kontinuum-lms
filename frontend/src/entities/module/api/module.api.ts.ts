import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {Module} from "@/entities/module";

export const getModuleById = async(id: string) : Promise<ApiResponse<Module>> => {
    return await api.get<ApiResponse<Module>>(`/lessons/${id}`)
}