import {api} from "@/shared/api";
import {CompleteBlocksRequest} from "@/entities/progress/model/types";

export const completeBlocks = async (data: CompleteBlocksRequest) : Promise<string[]> => {
    return await api.post<string[]>("/progress/complete-blocks", data, {auth : true})
}

export const getCompletedBlocks = async (id: string) : Promise<string[]> => {
   return api.get<string[]>(`/progress/lessons/${id}/completed-blocks`, {auth : true})
}