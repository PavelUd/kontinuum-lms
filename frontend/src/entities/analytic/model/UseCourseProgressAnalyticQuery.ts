import {useQuery} from "@tanstack/react-query";
import {GetCourseProgressAnalytic} from "@/entities/analytic/api/progress.analytic.api";

export function UseCourseProgressAnalyticQuery(id: string) {
    return useQuery({
        queryKey: ["course-progress-analytic", id],
        queryFn: () => GetCourseProgressAnalytic(id),
        enabled: !!id
    })
}