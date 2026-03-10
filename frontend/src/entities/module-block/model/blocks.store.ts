import { create } from "zustand"
import {BlocksState, BlockStatus, BlockType, ModuleBlock} from "@/entities/module-block/model/types";
import {getDefaultBlockContent} from "@/entities/module-block/model/block-defaults";

type BlocksStore = BlocksState & {

    addBlock: (type: BlockType) => string

    moveBlock: (id: string, direction: "up" | "down") => void

    replaceTempId: (tempId: string, realId: string) => void

    updateBlock: (id: string, content: any) => void

    removeBlock: (id: string) => void

    setStatus: (id: string, status: BlockStatus) => void

    reorderBlocks: (from: number, to: number) => void

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

    addBlock: (type) => {

        const id = crypto.randomUUID()

        const block: ModuleBlock<any> = {
            id,
            type,
            orderIndex: get().blockOrder.length,
            content:  getDefaultBlockContent(type),
            status: "saving"
        }

        set(state => ({
            blockOrder: [...state.blockOrder, id],
            blocksById: {
                ...state.blocksById,
                [id]: block
            }
        }))

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
                status: "saved"
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

        console.log(id, content)
        set(state => ({
            blocksById: {
                ...state.blocksById,
                [id]: {
                    ...state.blocksById[id],
                    content
                }
            }
        }))
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
    },

    setStatus: (id, status) => {

        set(state => ({
            blocksById: {
                ...state.blocksById,
                [id]: {
                    ...state.blocksById[id],
                    status
                }
            }
        }))
    },

    reorderBlocks: (from, to) => {

        set(state => {

            const newOrder = [...state.blockOrder]

            const [moved] = newOrder.splice(from, 1)

            newOrder.splice(to, 0, moved)

            return {
                blockOrder: newOrder
            }

        })
    },

    loadBlocks: (blocks) => {

        const order: string[] = []
        const map: Record<string,ModuleBlock<any>> = {}

        blocks.forEach(b => {
            order.push(b.id)
            map[b.id] = { ...b, status: "saved" }
        })

        set({
            blockOrder: order,
            blocksById: map
        })
    }

}))