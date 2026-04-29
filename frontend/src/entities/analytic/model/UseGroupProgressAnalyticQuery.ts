import {useQuery} from "@tanstack/react-query";
import {GetGroupProgressAnalytic, GetGroupsProgressAnalytic} from "@/entities/analytic/api/progress.analytic.api";

export function UseGroupsProgressAnalyticQuery(courseId: string, moduleId : string) {
    return useQuery({
        queryKey: ["groups-progress-analytic", courseId, moduleId],
        queryFn: () => GetGroupsProgressAnalytic(courseId, moduleId),
        enabled: !!moduleId
    })
}

export function UseGroupProgressAnalyticQuery(groupId: string, moduleId : string) {
    return useQuery({
        queryKey: ["group-progress-analytic", groupId, moduleId],
        queryFn: () => GetGroupProgressAnalytic(groupId, moduleId),
        enabled: !!groupId
    })
}