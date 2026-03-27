
import {  ModuleBlock } from "@/entities/module-block/model/types"
import {getBlock} from "@/entities/module-block/lib/block-registry"
import "@/entities/module-block/lib/register-blocks"
import styles from "./module.module.css"
import {useBlocksObserver} from "@/widgets/module/models/useBlocksObserver";
import {useCallback, useEffect, useRef} from "react";

type Props = {
    blocks: ModuleBlock<any>[]
    completedBlocks: string[],
    track: (blockId: string, payload: any) => void

}

export function ModuleContent({ blocks,completedBlocks, track }: Props) {
    const completedRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        console.log(completedBlocks);
        completedRef.current = new Set(completedBlocks)
    }, [completedBlocks])

    const { observe, unobserve } = useBlocksObserver((id, duration, isLeave) => {
        if (completedRef.current.has(id)){
            return
        }

        console.log("viewed:", id, duration, isLeave)
        track(id, {duration: duration})
    }, () => {console.log("hello333")})

    const setRef = useCallback((el: HTMLElement | null) => {
        if (!el) return
        observe(el)
        console.log("hello");
    }, [observe])

    return (
        <div className={styles.moduleContent}>
            {blocks.map(block => {
                const Block = getBlock(block.type)
                if (!Block) return null

                return (
                    <div
                        key={block.id}
                        data-id={block.id}
                        data-type={block.type}
                        ref={setRef}
                    >
                        <Block content={block.content} />
                    </div>
                )
            })}
        </div>
    )
}