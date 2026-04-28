export type LessonAnalyticProgress = {
    lessonId: string,
    avgProgress: number,
    avgScore: number
}

export type CourseAnalyticProgress = {
    studentsCount : number,
    lessons : LessonAnalyticProgress[]
}