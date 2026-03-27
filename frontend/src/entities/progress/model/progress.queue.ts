

type BlockEvent = {
    id: string
    payload: any
}

export class ProgressQueue {
    private queue: BlockEvent[] = []
    private isFlushing = false

    constructor(
        private send: (data: any) => Promise<any>
    ) {}

    add(event: BlockEvent) {
        this.queue.push(event)
        this.flushDebounced()
    }

    private timer: any = null
    private retryTimer: any = null

    private flushDebounced() {
        if (this.queue.length >= 10) {
            this.flush()
            this.clearTimer()
            return
        }
        if (this.timer) return

        this.timer = setTimeout(() => {
            this.timer = null
            this.flush()
        }, 1000) // например 2 секунды
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

    forceEnqueueAndSend(events: BlockEvent[]) {
        if (!events?.length) return
        this.queue.push(...events)
        this.flush()
    }

    async flush() {
        if (this.isFlushing) return
        if (this.queue.length === 0) return

        this.isFlushing = true

        const batch = Array.from(this.queue.values())
        this.queue = []

        try {
            this.send(batch)

            if (this.retryTimer) {
                clearTimeout(this.retryTimer)
                this.retryTimer = null
            }

        } catch (e) {
            batch.forEach(b => this.queue.push(b))
        }

        this.isFlushing = false
        if (!this.retryTimer && this.queue.length > 0) {
            this.retryTimer = setTimeout(() => {
                this.retryTimer = null
                this.flush()
            }, 10000)
        }
    }
}