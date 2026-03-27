import {useMutation, useQueryClient} from "@tanstack/react-query"
import {completeBlocks} from "@/entities/progress/api/progress.api";

export function useCompleteBlocksMutation(lessonId : string, courseId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: completeBlocks,

         onSuccess: async (res, variables) =>  {
            const completedIds = res;
            queryClient.setQueryData(["lesson-progress", lessonId], (old: any) => {
                if (!old) return old

                const set = new Set(old);

                completedIds.forEach(id => set.add(id))
///?
                return Array.from(new Set([...old, ...completedIds]))
            })

             queryClient.setQueryData(["course-progress", courseId], (old: any = []) => {
                 const lessonBlocks =
                     queryClient.getQueryData<string[]>(["lesson-progress", lessonId]) ?? []

                 const lessonProgress = Math.round(
                     (lessonBlocks.length / Number(variables.totalBlocks)) * 100
                 )

                 const exists = old.find((x: any) => x.lessonId === lessonId)

                 if (exists) {
                     return old.map((x: any) =>
                         x.lessonId === lessonId
                             ? { ...x, progress: lessonProgress }
                             : x
                     )
                 }

                 return [
                     ...old,
                     {
                         lessonId,
                         progress: lessonProgress
                     }
                 ]
             })

        }
    })
}