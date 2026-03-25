import {useMutation, useQueryClient} from "@tanstack/react-query"
import {completeBlocks} from "@/entities/progress/api/progress.api";

export function useCompleteBlocksMutation(lessonId : string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: completeBlocks,

        onSuccess: (res) => {
            const completedIds = res;
            queryClient.setQueryData(["lesson-progress", lessonId], (old: any) => {
                if (!old) return old

                const set = new Set(old);

                completedIds.forEach(id => set.add(id))
///?
                return Array.from(new Set([...old, ...completedIds]))
            })
        }
    })
}