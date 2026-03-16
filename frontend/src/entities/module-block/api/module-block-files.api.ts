import {uploadFileRequest, uploadFileResult} from "@/entities/module-block/model/types";
import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";

export const getUploadUrl = async(id: string, body: uploadFileRequest) : Promise<ApiResponse<uploadFileResult>> => {
    return await api.post<ApiResponse<uploadFileResult>>(`/blocks/${id}/file/presigned`, body, {auth: true})
}

export const deleteFile = async(id: string) : Promise<ApiResponse<null>> => {
    return await api.delete<ApiResponse<null>>(`/blocks/${id}/file`, {auth: true})
}

