import {LessonAnalyticProgress} from "@/entities/analytic/model/types";


export function getCourseAvgProgress(
    items: LessonAnalyticProgress[],
    totalLessons: number
): { progress: number; score: number } {
    if (!totalLessons) return { progress: 0, score: 0 };

    const progressSum = sumBy(items, x => x.avgProgress);
    const scoreSum = sumBy(items, x => x.avgScore);

    return {
        progress: Math.round(progressSum / totalLessons),
        score: Math.round(scoreSum / totalLessons)
    };
}

function sumBy<T>(
    items: T[],
    selector: (item: T) => number | undefined
): number {
    return items?.reduce(
        (acc, item) => acc + (selector(item) ?? 0),
        0
    ) ?? 0;
}