import {useCompleteBlocksMutation} from "@/entities/progress/model/useCompleteBlocksMutation";
import {useMemo} from "react";
import {ProgressQueue} from "@/entities/progress/model/progress.queue";

export function useProgressTracker(lessonId: string) {
    const mutation = useCompleteBlocksMutation(lessonId)

    const queue = useMemo(() => {
        return new ProgressQueue(mutation.mutateAsync)
    }, [lessonId])

    return {
        track: (blockId: string, payload: any) => {
            queue.add({ id: blockId, payload })
        }
    }
}