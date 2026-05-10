import {ModuleSummary} from "@/entities/module";

export interface CourseSummary {
    id: string
    name: string
    avatarUrl: string
    status: Status
    lessonsCount: number
}

export type Status = "active" | "archived" | "draft"

export type CourseSummaryState = {
    courses: CourseSummary[]
    isLoading: boolean
    error: string | null
}

export interface CourseLookup {
    id: string
    name: string
}

export type SetStatusRequest = {
    status: Status
}

export type CreateCourseRequest = {
    name: string
    avatarUrl?: string
}

export interface Course {
    id: string
    name: string
    avatarUrl: string
    lessons: ModuleSummary[]
    lessonsCount: number
}