import { api } from '@/shared/api'
import type { Course } from '../model/types'
import {ApiResponse} from "@/shared/api/types/api-response";


export const getCourses = async (): Promise<ApiResponse<Course[]>> => {
    return api.get<ApiResponse<Course[]>>('courses')
}