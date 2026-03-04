import { useQuery } from '@tanstack/react-query'
import {courseApiTs, getCourseById} from '../api/course.api.ts'
import type {Course, CourseSummary} from './types'
import {ApiResponse} from "@/shared/api/types/api-response";

export const CoursesQueryKey = ['courses'] as const

export const useCoursesQuery = () => {
    return useQuery<ApiResponse<CourseSummary[]>>({
        queryKey: CoursesQueryKey,
        queryFn: courseApiTs,
    })
}

export function useCourseQuery(courseId: string) {
    return useQuery<ApiResponse<Course>>({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId
    })
}