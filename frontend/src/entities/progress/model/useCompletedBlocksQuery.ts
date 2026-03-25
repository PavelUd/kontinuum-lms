import {useQuery} from "@tanstack/react-query";
import {getCompletedBlocks} from "@/entities/progress/api/progress.api";

export function useCompletedBlocksQuery(lessonId: string) {
    return useQuery({
        queryKey: ["lesson-progress", lessonId],
        queryFn: () => getCompletedBlocks(lessonId),
        enabled: !!lessonId
    })
}