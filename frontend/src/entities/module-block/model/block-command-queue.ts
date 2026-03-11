import {BlockCommand} from "./types"
import {useLessonBlocksStore} from "@/entities/module-block/model/blocks.store";
import {createBlock, deleteBlock, moveBlock, updateBlockContent} from "@/entities/module-block/api/module-block.api";

export class BlockCommandQueue {


    private queue: BlockCommand[] = []
    private processing = false


    enqueue(cmd: BlockCommand) {

        this.queue = this.optimizeQueue(this.queue, cmd)

        if (!this.processing) {
            this.process()
        }
    }

    private async process() {

        this.processing = true

        while (this.queue.length > 0) {

            const cmd = this.queue[0]

            try {

                await this.execute(cmd)

            } catch (e) {
                console.error("command failed", e)
            }

            this.queue.shift()
        }

        this.processing = false
    }

    private async execute(cmd: BlockCommand) {

        switch (cmd.type) {

            case "create": {

                const res = await createBlock(cmd.lessonId, cmd.payload)
                const realId = res.data;

                useLessonBlocksStore
                    .getState()
                    .replaceTempId(cmd.tempId,realId)

                this.replaceId(cmd.tempId, realId)
                break
            }

            case "update": {
                await updateBlockContent(cmd.id,{content: cmd.payload})
                break
            }

            case "delete": {
                console.log("hello delete")
                await deleteBlock(cmd.id)

                break
            }

            case "reorder": {
                await moveBlock(cmd.id,{ "moveUp": cmd.moveUp })

                break
            }
        }
    }

    private replaceId(tempId: string, realId: string) {

        this.queue.forEach(cmd => {

            if ("id" in cmd && cmd.id === tempId) {
                cmd.id = realId
            }

        })
    }

    private optimizeQueue(queue: BlockCommand[], cmd: BlockCommand) {

        const q = [...queue]

        if (cmd.type === "update") {

            const index = q.findLastIndex(
                c => c.type === "update" && c.id === cmd.id
            )

            if (index !== -1) {
                q[index] = cmd
                return q
            }
        }

        if (cmd.type === "delete") {

            const createIndex = q.findIndex(
                c => c.type === "create" && c.tempId === cmd.id
            )

            if (createIndex !== -1) {
                q.splice(createIndex, 1)
                return q
            }
        }

        q.push(cmd)

        return q
    }

}

export const blockCommandQueue = new BlockCommandQueue()