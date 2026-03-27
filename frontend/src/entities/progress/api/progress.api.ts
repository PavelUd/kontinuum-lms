import {api} from "@/shared/api";
import {CompleteBlocksRequest, CourseProgress, LessonProgress} from "@/entities/progress/model/types";

export const completeBlocks = async (data: CompleteBlocksRequest) : Promise<string[]> => {
    return await api.post<string[]>("/progress/complete-blocks", data.blocks, {auth : true})
}

export const getCompletedBlocks = async (id: string) : Promise<string[]> => {
   return api.get<string[]>(`/progress/lessons/${id}/completed-blocks`, {auth : true})
}

export const getCourseProgress = async (id: string) : Promise<LessonProgress[]> => {
    return api.get<LessonProgress[]>(`/progress/courses/${id}/lessons`, {auth : true})
}