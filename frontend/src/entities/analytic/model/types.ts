import {GetEngagementStats} from "@/entities/analytic/api/engagement.analytic.api";

export type LessonAnalyticProgress = {
    lessonId: string,
    avgProgress: number,
    studentsCount : number,
    avgScore: number
}

export type HeatmapItem = {
    "blockId": string,
    "lessonId": string,
    "viewsCount": number,
    "avgTimeSpent": number
}

export type CourseAnalyticProgress = {
    studentsCount : number,
    lessons : LessonAnalyticProgress[]
}

export type UserAnalyticProgress = {
    id : string,
    name: string,
    progress : number,
}

export type GroupAnalyticProgress = {
    id : string,
    title: string,
    avgProgress : number,
}