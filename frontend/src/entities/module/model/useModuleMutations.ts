import {useMutation} from "@tanstack/react-query";
import {publishLesson, rollbackLesson} from "@/entities/module/api/module.api";
import {useModuleBlocks} from "@/entities/module-block/model/useModuleBlocks";
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {queryClient} from "@/shared/api";


export function usePublishLessonMutation() {

    const publishMutation = useMutation({
        mutationFn: (draftId: string) =>
            publishLesson(draftId),
    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ['modules']
        })
    }})

    return {
        publish: publishMutation.mutateAsync,
        isPublishing: publishMutation.isPending,
    }
}

export function useRollbackLessonMutation(
    lessonId: string, draftId: string
) {

    const {
        data,
        refetch,
    } = useModuleBlocks(draftId)

    const loadBlocks = useLessonBlocksStore(
        s => s.loadBlocks
    )

    const rollbackMutation = useMutation({
        mutationFn: () =>
            rollbackLesson(lessonId),

        onSuccess: async () => {
            await refetch()
            await queryClient.invalidateQueries({
                queryKey: ['module', draftId]
            })
            loadBlocks(data, draftId)
        },
    })

    return {
        rollback: rollbackMutation.mutateAsync,
        isRollbacking: rollbackMutation.isPending,
    }
}