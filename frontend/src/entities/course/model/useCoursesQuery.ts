import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../api/getCourses'
import type { Course } from './types'
import {ApiResponse} from "@/shared/api/types/api-response";

export const CoursesQueryKey = ['courses'] as const

export const useCoursesQuery = () => {
    return useQuery<ApiResponse<Course[]>>({
        queryKey: CoursesQueryKey,
        queryFn: getCourses,
    })
}