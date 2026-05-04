type QueueItem = { id: string }

export abstract class EventQueue<T extends QueueItem> {
    protected queue: T[] = []
    private isFlushing = false

    private timer: any = null
    private retryTimer: any = null

    constructor(
        private sendFn: (data: any[]) => Promise<any>,
        protected batchSize: number = 10,
        protected debounceMs: number = 1000,
        protected retryMs: number = 10000
    ) {}

    add(event: T) {
        this.queue.push(event)
        this.flushDebounced()
    }

    forceEnqueueAndSend(events: T[]) {
        if (!events?.length) return
        this.queue.push(...events)
        this.flush()
    }

    private flushDebounced() {
        if (this.queue.length >= this.batchSize) {
            this.flush()
            this.clearTimer()
            return
        }

        if (this.timer) return

        this.timer = setTimeout(() => {
            this.timer = null
            this.flush()
        }, this.debounceMs)
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

    async flush() {
        if (this.isFlushing || this.queue.length === 0) return

        this.isFlushing = true

        const batch = this.queue
        this.queue = []

        try {
            this.sendFn(batch)

            if (this.retryTimer) {
                clearTimeout(this.retryTimer)
                this.retryTimer = null
            }
        } catch (e) {
            // сохраняем порядок
            this.queue.unshift(...batch)
        }

        this.isFlushing = false

        if (!this.retryTimer && this.queue.length > 0) {
            this.retryTimer = setTimeout(() => {
                this.retryTimer = null
                this.flush()
            }, this.retryMs)
        }
    }
}