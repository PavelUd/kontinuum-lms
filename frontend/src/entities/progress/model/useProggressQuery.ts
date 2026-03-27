import {useQuery} from "@tanstack/react-query";
import {getCourseProgress} from "@/entities/progress/api/progress.api";

export function useCourseProgressQuery(courseId: string) {
    return useQuery({
        queryKey: ["course-progress", courseId],
        queryFn: () => getCourseProgress(courseId),
        enabled: !!courseId
    })
}