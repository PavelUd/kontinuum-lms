import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {Module, ModuleSummary} from "@/entities/module";
import {CreateModuleRequest, UpdateTitleBlockProps} from "@/entities/module/model/types";
import {SetStatusRequest} from "@/entities/course/model/types";

export const getModuleById = async(id: string) : Promise<ApiResponse<ModuleSummary>> => {
    return await api.get<ApiResponse<ModuleSummary>>(`/lessons/${id}`)
}

export const updateModuleTitle = async(id: string,content: UpdateTitleBlockProps) : Promise<ApiResponse<null>> => {
    return await api.patch<ApiResponse<null>>(`/lessons/${id}`, content, {auth: true})
}

export const getModules = async(id: string) : Promise<ApiResponse<ModuleSummary[]>> => {
    return await api.get<ApiResponse<ModuleSummary[]>>(`courses/${id}/lessons`)
}

export const setModuleStatus = async(id: string,content: SetStatusRequest) : Promise<void> => {
    return await api.post<void>(`/lessons/${id}/status`, content, {auth: true})
}

export const createModule = async(request : CreateModuleRequest) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/courses/${request.courseId}/lessons`, { title: request.title, orderIndex : request.orderIndex }, {auth: true})
}

export const deleteModule = async(lessonId: string) : Promise<void> => {
    return await api.delete<void>(`/lessons/${lessonId}`, {auth: true})
}

