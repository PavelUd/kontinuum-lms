import {EventQueue} from "@/shared/lib/queue/event-queue";
import {EngagementItem} from "@/entities/engagement/models/types";

type EngagementEvent = {
    lessonId : string
    id: string;
    totalTimeSpent : number
}

export class EngagementQueue extends EventQueue<EngagementEvent> {
    constructor(send: (blocks: EngagementItem[]) => Promise<any>) {
        super(send, 10, 1000, 10000)
    }
}