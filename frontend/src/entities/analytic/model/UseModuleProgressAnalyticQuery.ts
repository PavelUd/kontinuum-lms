import {useQuery} from "@tanstack/react-query";
import {GetModuleProgressAnalytic} from "@/entities/analytic/api/progress.analytic.api";

export function UseModuleProgressAnalyticQuery(courseId: string, moduleId : string) {
    return useQuery({
        queryKey: ["module-progress-analytic", courseId, moduleId],
        queryFn: () => GetModuleProgressAnalytic(courseId, moduleId),
    })
}