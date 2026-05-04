import {useMemo, useRef} from "react";
import {track} from "@/entities/engagement/api/engagement.api";
import {EngagementQueue} from "@/entities/engagement/models/engagement.queue";

export function useEngagementTracking(lessonId: string) {
    const trackedRef = useRef<Set<string>>(new Set())
    const send = track

    const queue = useMemo(() => {
        return new EngagementQueue(send)
    }, [send])
    const trackBlock = (blockId: string, totalTimeSpent: number) => {
        const key = `${lessonId}:${blockId}`

        if (trackedRef.current.has(key)) return

        trackedRef.current.add(key)

        queue.add({
            id: blockId,
            lessonId,
            totalTimeSpent
        })
    }

    return {
        track: trackBlock
    }
}