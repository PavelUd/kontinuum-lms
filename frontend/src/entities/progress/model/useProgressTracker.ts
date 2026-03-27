import {useCompleteBlocksMutation} from "@/entities/progress/model/useCompleteBlocksMutation";
import {useCallback, useMemo} from "react";
import {ProgressQueue} from "@/entities/progress/model/progress.queue";
import {CompleteBlockItem} from "@/entities/progress/model/types";

export function useProgressTracker(lessonId: string, courseId: string, blocksCount?: number) {

    const mutation = useCompleteBlocksMutation(lessonId, courseId);

    const send = useCallback(async (blocks: CompleteBlockItem[]) => {
        if (!blocksCount) return
        return mutation.mutateAsync({
            totalBlocks: blocksCount,
            blocks: blocks
        })
    }, [mutation, lessonId, courseId, blocksCount])

    const queue = useMemo(() => {
        return new ProgressQueue(send)
    }, [send])

    return {
        track: (blockId: string, payload: any) => {
            queue.add({ id: blockId, payload })
        }
    }
}