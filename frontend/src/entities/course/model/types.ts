import {ModuleSummary} from "@/entities/module";

export interface CourseSummary {
    id: string
    name: string
    avatarUrl: string
    lessonsCount: number
}

export interface Course {
    id: string
    name: string
    avatarUrl: string
    lessons: ModuleSummary[]
    lessonsCount: number
}