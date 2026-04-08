import {api} from '@/shared/api'
import {Course, CourseLookup, CourseSummary, CreateCourseRequest, SetStatusRequest} from '../model/types'
import {ApiResponse} from "@/shared/api/types/api-response";



export const courseApi = async (): Promise<ApiResponse<CourseSummary[]>> => {
    return api.get<ApiResponse<CourseSummary[]>>('courses')
}

export const getCourseById = async(courseId: string) : Promise<ApiResponse<CourseSummary>> => {
    return await api.get<ApiResponse<CourseSummary>>(`/courses/${courseId}`)
}

export const setStatus = async(courseId: string, content: SetStatusRequest) : Promise<void> => {
    return await api.patch<void>(`/courses/${courseId}/status`, content, {auth: true})
}

export const deleteCourse = async(courseId: string) : Promise<void> => {
    return await api.delete<void>(`/courses/${courseId}`, {auth: true})
}

export const createCourse = async(body : CreateCourseRequest) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/courses`, body, {auth: true})
}

export const getCoursesLookup = async() : Promise<CourseLookup[]> => {
    return await api.get<CourseLookup[]>(`/courses/lookup`, {auth: true})
}