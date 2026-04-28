import {useQuery} from '@tanstack/react-query'
import {courseApi, getCourseById, getCoursesLookup, getMyCourses} from '../api/course.api'
import type {CourseLookup, CourseSummary} from './types'
import {ApiResponse} from "@/shared/api/types/api-response";

export const CoursesQueryKey = ['courses'] as const

export const useCoursesQuery = () => {
    return useQuery<ApiResponse<CourseSummary[]>>({
        queryKey: CoursesQueryKey,
        queryFn: courseApi,
    })
}

export const useMyCoursesQuery = () => {
    return useQuery<ApiResponse<CourseSummary[]>>({
        queryKey: ['my-courses'],
        queryFn: getMyCourses,
    })
}

export const useCoursesLookupQuery = () => {
    return useQuery<CourseLookup[]>({
        queryKey: ['courses_lookup'],
        queryFn: getCoursesLookup,
    })
}

export const useCourseQuery = (courseId: string) => {
    return useQuery<ApiResponse<CourseSummary>>({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId
    })
}