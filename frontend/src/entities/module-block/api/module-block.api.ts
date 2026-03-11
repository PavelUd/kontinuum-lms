import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {CreateBlockProps, MoveUpBlockProps, UpdateContentBlockProps} from "@/entities/module-block/model/types";




export const createBlock = async(id: string, body: CreateBlockProps) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/lessons/${id}/blocks`, body, {auth: true})
}

export const deleteBlock = async(id: string) : Promise<ApiResponse<null>> => {
    return await api.delete<ApiResponse<null>>(`/blocks/${id}`, {auth: true})
}

export const updateBlockContent = async(id: string, content: UpdateContentBlockProps) : Promise<ApiResponse<null>> => {
    return await api.patch<ApiResponse<null>>(`/blocks/${id}/content`, content, {auth: true})
}

export const moveBlock = async(id: string, content: MoveUpBlockProps) : Promise<ApiResponse<null>> => {
    return await api.patch<ApiResponse<null>>(`/blocks/${id}/order-index`, content, {auth: true})
}
