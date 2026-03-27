export type CompleteBlockPayload = {
    duration?: number
}

export type CompleteBlockItem = {
    blockId: string
    payload: CompleteBlockPayload
}

export type CompleteBlocksRequest = {
    blocks: CompleteBlockItem[]
    totalBlocks: number
}

export type LessonProgress = {
    lessonId: string,
    progress: number
}

export type CourseProgress = {
    courseId: string,
    progress: number
}