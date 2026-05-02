import {api} from "@/shared/api";
import {CompleteBlocksRequest, LessonProgress} from "@/entities/progress/model/types";
import {AnswerQuestionRequest, AnswerQuestionResponse, ModuleBlock} from "@/entities/module-block/model/types";
import {ApiResponse} from "@/shared/api/types/api-response";

export const completeBlocks = async (data: CompleteBlocksRequest) : Promise<string[]> => {
    return await api.post<string[]>("/progress/complete-blocks", data.blocks, {auth : true})
}

export const getCompletedBlocks = async (id: string) : Promise<string[]> => {
   return api.get<string[]>(`/progress/lessons/${id}/completed-blocks`, {auth : true})
}

export const getCourseProgress = async (id: string) : Promise<LessonProgress[]> => {
    return api.get<LessonProgress[]>(`/progress/courses/${id}/lessons`, {auth : true})
}

export const submitAnswer = async(id: string, data : AnswerQuestionRequest) : Promise<AnswerQuestionResponse> => {
    return await api.post<AnswerQuestionResponse>(`/blocks/${id}/submit-answer`,data, {auth: true})
}