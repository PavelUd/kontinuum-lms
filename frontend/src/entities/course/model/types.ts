import {ModuleSummary} from "@/entities/module";

export interface CourseSummary {
    id: string
    name: string
    avatarUrl: string
    status: CourseStatus
    lessonsCount: number
}

export type CourseStatus = "active" | "archived"

export type CourseSummaryState = {
    courses: CourseSummary[]
    isLoading: boolean
    error: string | null
}

export type SetCourseStatusRequest = {
    status: CourseStatus
}

export interface Course {
    id: string
    name: string
    avatarUrl: string
    lessons: ModuleSummary[]
    lessonsCount: number
}