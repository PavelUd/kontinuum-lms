import {EventQueue} from "@/shared/lib/queue/event-queue";
import {CompleteBlockItem} from "@/entities/progress/model/types";


type BlockEvent = {
    id: string
    payload: any
}

export class ProgressQueue extends EventQueue<BlockEvent> {
    constructor(send: (blocks: CompleteBlockItem[]) => Promise<any>) {
        super(send, 10, 1000, 10000)
    }
}