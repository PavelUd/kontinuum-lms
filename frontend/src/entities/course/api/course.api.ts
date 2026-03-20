import {api} from '@/shared/api'
import type {Course, CourseSummary, SetCourseStatusRequest} from '../model/types'
import {ApiResponse} from "@/shared/api/types/api-response";



export const courseApi = async (): Promise<ApiResponse<CourseSummary[]>> => {
    return api.get<ApiResponse<CourseSummary[]>>('courses')
}

export const getCourseById = async(courseId: string) : Promise<ApiResponse<Course>> => {
    return await api.get<ApiResponse<Course>>(`/courses/${courseId}`)
}

export const setStatus = async(courseId: string, content: SetCourseStatusRequest) : Promise<ApiResponse<null>> => {
    return await api.patch<ApiResponse<null>>(`/courses/${courseId}/status`, content, {auth: true})
}