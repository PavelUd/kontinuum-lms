export type LessonAnalyticProgress = {
    lessonId: string,
    avgProgress: number,
    studentsCount : number,
    avgScore: number
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