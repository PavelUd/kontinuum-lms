import {useQuery} from '@tanstack/react-query'
import {courseApi, getCourseById} from '../api/course.api'
import type {Course, CourseSummary} from './types'
import {ApiResponse} from "@/shared/api/types/api-response";

export const CoursesQueryKey = ['courses'] as const

export const useCoursesQuery = () => {
    return useQuery<ApiResponse<CourseSummary[]>>({
        queryKey: CoursesQueryKey,
        queryFn: courseApi,
    })
}

export const useCourseQuery = (courseId: string) => {
    return useQuery<ApiResponse<Course>>({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId
    })
}