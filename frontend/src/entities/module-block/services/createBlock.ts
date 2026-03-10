import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {BlockType} from "@/entities/module-block/model/types";


export async function createBlock(type: BlockType) {

    const { addBlock, replaceTempId, setActiveBlock, setStatus } = useLessonBlocksStore.getState()
    const tempId = addBlock(type)
    setActiveBlock(tempId)
    try {

    } catch {

        setStatus(tempId, "error")

    }

}