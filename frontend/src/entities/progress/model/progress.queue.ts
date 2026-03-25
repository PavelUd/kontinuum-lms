

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
        console.log(event);
        this.flushDebounced()
    }

    private timer: any = null
    private retryTimer: any = null

    private flushDebounced() {
        if (this.queue.length >= 10) {
            this.flush()
            return
        }
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