import { create } from "zustand"
import {BlocksState, BlockType, CreateBlockProps, ModuleBlock} from "@/entities/module-block/model/types";
import {getDefaultBlockContent} from "@/entities/module-block/model/block-defaults";
import {blockCommandQueue} from "@/entities/module-block/model/block-command-queue";

type BlocksStore = BlocksState & {

    addBlock: (type: BlockType, lessonId: string) => string

    moveBlock: (id: string, direction: "up" | "down") => void

    replaceTempId: (tempId: string, realId: string) => void

    updateBlock: (id: string, content: any) => void

    removeBlock: (id: string) => void

    loadBlocks: (blocks: ModuleBlock<any>[]) => void

    setActiveBlock: (id: string | null) => void

    activeBlockId: null | string,
}

export const useLessonBlocksStore = create<BlocksStore>((set, get) => ({

    blockOrder: [],
    blocksById: {},
    activeBlockId: null,

    setActiveBlock: (id) =>
        set({
            activeBlockId: id
        }),

    addBlock: (type, lessonId) => {

        const id = crypto.randomUUID()

        const block: ModuleBlock<any> = {
            id,
            type,
            orderIndex: get().blockOrder.length,
            content:  getDefaultBlockContent(type),
        }

        set(state => ({
            blockOrder: [...state.blockOrder, id],
            blocksById: {
                ...state.blocksById,
                [id]: block
            }
        }))

        blockCommandQueue.enqueue({
            type: "create",
            tempId: id,
            lessonId: lessonId,
            payload: {
                content: block.content,
                type: block.type,
            }
        })

        return id
    },

    moveBlock: (id: string, direction: "up" | "down") => {

        set(state => {

            const index = state.blockOrder.indexOf(id)

            if (index === -1) return state

            const target =
                direction === "up"
                    ? index - 1
                    : index + 1

            if (target < 0 || target >= state.blockOrder.length)
                return state

            const newOrder = [...state.blockOrder]
            const [moved] = newOrder.splice(index, 1)
            newOrder.splice(target, 0, moved)
            const newBlocks = { ...state.blocksById }

            newOrder.forEach((blockId, i) => {
                newBlocks[blockId] = {
                    ...newBlocks[blockId],
                    orderIndex: i
                }
            })

            blockCommandQueue.enqueue({
                type: "reorder",
                id: id,
                moveUp :  direction === "up"
            })

            return {
                blockOrder: newOrder,
                blocksById: newBlocks
            }
        })
    },

    replaceTempId: (tempId, realId) => {

        set(state => {

            const block = state.blocksById[tempId]

            if (!block) return state

            const newBlocks = { ...state.blocksById }

            delete newBlocks[tempId]

            newBlocks[realId] = {
                ...block,
                id: realId,
            }

            return {
                blockOrder: state.blockOrder.map(id =>
                    id === tempId ? realId : id
                ),
                blocksById: newBlocks
            }

        })
    },

    updateBlock: (id, content) => {

        set(state => ({
            blocksById: {
                ...state.blocksById,
                [id]: {
                    ...state.blocksById[id],
                    content
                }
            }
        }))

        blockCommandQueue.enqueue({
            type: "update",
            id,
            payload: content
        })
    },

    removeBlock: (id) => {

        set(state => {

            const newBlocks = { ...state.blocksById }
            delete newBlocks[id]

            return {
                blockOrder: state.blockOrder.filter(x => x !== id),
                blocksById: newBlocks
            }

        })

        blockCommandQueue.enqueue({
            type: "delete",
            id
        })
    },

    loadBlocks: (blocks) => {

        const order: string[] = []
        const map: Record<string,ModuleBlock<any>> = {}

        blocks.forEach(b => {
            order.push(b.id)
            map[b.id] = { ...b, }
        })

        set({
            blockOrder: order,
            blocksById: map
        })
    }

}))