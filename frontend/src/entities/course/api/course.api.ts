import {api} from '@/shared/api'
import type {Course, CourseSummary} from '../model/types'
import {ApiResponse} from "@/shared/api/types/api-response";


export const courseApi = async (): Promise<ApiResponse<CourseSummary[]>> => {
    return api.get<ApiResponse<CourseSummary[]>>('courses')
}

export const getCourseById = async(courseId: string) : Promise<ApiResponse<Course>> => {
    return await api.get<ApiResponse<Course>>(`/courses/${courseId}`)
}