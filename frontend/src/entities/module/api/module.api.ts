import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {Module} from "@/entities/module";
import {UpdateTitleBlockProps} from "@/entities/module/model/types";

export const getModuleById = async(id: string) : Promise<ApiResponse<Module>> => {
    return await api.get<ApiResponse<Module>>(`/lessons/${id}`)
}

export const updateModuleTitle = async(id: string,content: UpdateTitleBlockProps) : Promise<ApiResponse<null>> => {
    return await api.patch<ApiResponse<null>>(`/lessons/${id}/title`, content, {auth: true})
}