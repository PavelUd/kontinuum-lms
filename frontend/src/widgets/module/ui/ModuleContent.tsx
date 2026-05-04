
import {  ModuleBlock } from "@/entities/module-block/model/types"
import {getBlock} from "@/entities/module-block/lib/block-registry"
import "@/entities/module-block/lib/register-blocks"
import styles from "./module.module.css"
import {useBlocksObserver} from "@/widgets/module/models/useBlocksObserver";
import {useCallback, useEffect, useRef} from "react";

type Props = {
    blocks: ModuleBlock<any>[]
    completedBlocks: string[],
    progressTrack : (blockId: string, payload: any) => void
    track: (blockId: string, totalTimeSpent: number) => void

}

export function ModuleContent({ blocks,completedBlocks, track, progressTrack }: Props) {
    const completedRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        completedRef.current = new Set(completedBlocks)
    }, [completedBlocks])

    const { observe, unobserve } = useBlocksObserver((id, duration, isLeave) => {
        track(id, duration)
        if (completedRef.current.has(id)){
            return
        }
        progressTrack(id, {duration: duration})
    }, () => {})

    const setRef = useCallback((el: HTMLElement | null) => {
        if (!el) return
        observe(el)
    }, [observe])

    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const isCompleted = completedBlocks.includes(block.id)

                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id}
                        data-id={block.id}
                        data-type={block.type}
                        ref={setRef}
                    >
                        <Block id={block.id} isCompleted={isCompleted} content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}