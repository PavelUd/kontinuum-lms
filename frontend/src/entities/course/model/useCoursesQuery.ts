import {useQuery, useQueryClient} from '@tanstack/react-query'
import {courseApi, getCourseById} from '../api/course.api'
import type {Course, CourseSummary} from './types'
import {ApiResponse} from "@/shared/api/types/api-response";
import { useEffect } from "react";
import {ModuleSummary} from "@/entities/module";

export const CoursesQueryKey = ['courses'] as const

export const useCoursesQuery = () => {
    return useQuery<ApiResponse<CourseSummary[]>>({
        queryKey: CoursesQueryKey,
        queryFn: courseApi,
    })
}

export function useCourseQuery(courseId: string) {
    const queryClient = useQueryClient()

    const query = useQuery<ApiResponse<Course>>({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId
    })

    useEffect(() => {
        const modules = query.data?.data.lessons
        if (!modules) return

        queryClient.setQueryData<ApiResponse<ModuleSummary[]>>(["modules"],{data: modules,succeeded: true,errors: [] })
    }, [query.data, courseId, queryClient])

    return query
}