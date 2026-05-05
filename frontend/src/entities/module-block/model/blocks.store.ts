import { create } from "zustand"
import {BlockContent, BlocksState, BlockType, ModuleBlock, SaveStatus} from "@/entities/module-block/model/types";
import {getDefaultBlockContent} from "@/entities/module-block/model/block-defaults";
import {BlockCommandQueue} from "@/entities/module-block/model/block-command-queue";

type BlocksStore = BlocksState & {

    saveStatus: SaveStatus

    setSaveStatus: (status: SaveStatus) => void

    addBlock : (type: BlockType, lessonId: string, content?: BlockContent) => string

    queue: BlockCommandQueue

    moduleId : string | null,

    moveBlock: (from: number, to: number, id: string) => void

    replaceTempId: (tempId: string, realId: string) => void

    updateBlock: (id: string, content: any) => void

    removeBlock: (id: string) => void

    loadBlocks: (blocks: ModuleBlock<any>[], moduleId : string) => void

    setActiveBlock: (id: string | null) => void

    activeBlockId: null | string,
}

export const useLessonBlocksStore = create<BlocksStore>((set, get) => ({


    blockOrder: [],
    blocksById: {},
    activeBlockId: null,
    moduleId: null,

    saveStatus: 'idle',

    setSaveStatus: (status) => set({ saveStatus: status }),

    queue : new BlockCommandQueue((status) => {
        set({ saveStatus: status })
    }),

    setActiveBlock: (id) =>
        set({
            activeBlockId: id
        }),

    addBlock: (type, lessonId, content) => {

        const id = crypto.randomUUID()

        const block: ModuleBlock<any> = {
            id,
            type,
            orderIndex: get().blockOrder.length,
            content: content ??  getDefaultBlockContent(type),
        }

        set(state => ({
            blockOrder: [...state.blockOrder, id],
            blocksById: {
                ...state.blocksById,
                [id]: block
            }
        }))

        get().queue.enqueue({
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

    moveBlock: (from: number, to: number, id: string) => {

        set(state => {

            const newOrder = [...state.blockOrder]

            const [moved] = newOrder.splice(from, 1)
            newOrder.splice(to, 0, moved)

            const newBlocks = { ...state.blocksById }

            newOrder.forEach((id, i) => {
                newBlocks[id] = {
                    ...newBlocks[id],
                    orderIndex: i
                }
            })

            const newIndex = newOrder.indexOf(moved)

            const aboveBlockId = newIndex > 0
                ? newOrder[newIndex - 1]
                : null

            const belowBlockId = newIndex < newOrder.length - 1
                ? newOrder[newIndex + 1]
                : null

            get().queue.enqueue({
                type: "reorder",
                id,
                payload: {belowBlockId : belowBlockId, aboveBlockId :aboveBlockId}
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

        get().queue.enqueue({
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

        get().queue.enqueue({
            type: "delete",
            id
        })
    },

    loadBlocks: (blocks, moduleId) => {

        const order: string[] = []

        set({
            moduleId: moduleId
        });
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