import {LessonProgress} from "@/entities/progress/model/types";

export class Progress {
    static getLessonProgressSum(items: LessonProgress[]): number {
        return items?.reduce(
            (acc, item) => acc + (item.progress ?? 0),
            0
        ) ?? 0
    }

    static getCourseProgress(
        items: LessonProgress[],
        totalLessons: number
    ): number {
        if (!totalLessons) return 0

        const sum = this.getLessonProgressSum(items)

        return Math.round(sum / totalLessons)
    }
}