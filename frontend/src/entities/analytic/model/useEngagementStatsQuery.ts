import {useQuery} from "@tanstack/react-query";
import {GetEngagementStats} from "@/entities/analytic/api/engagement.analytic.api";

export function UseEngagementStatsQuery(id: string) {
    return useQuery({
        queryKey: ["heatmap", id],
        queryFn: () => GetEngagementStats(id),
        enabled: !!id
    })
}