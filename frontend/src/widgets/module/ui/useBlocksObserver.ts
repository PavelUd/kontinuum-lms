import { useEffect, useRef, useCallback } from "react"

type Callback = (id: string, duration: number) => void

export function useBlocksObserver(onViewEnd: Callback) {
    const observerRef = useRef<IntersectionObserver | null>(null)

    const visibleMap = useRef<Map<string, number>>(new Map())
    const activeSet = useRef<Set<string>>(new Set())

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const now = Date.now()

                entries.forEach(entry => {
                    const id = entry.target.getAttribute("data-id")
                    if (!id) return

                    const isVisible = entry.intersectionRatio >= 0.6
                    const wasVisible = activeSet.current.has(id)

                    // START
                    if (isVisible && !wasVisible) {
                        activeSet.current.add(id)
                        visibleMap.current.set(id, now)
                    }

                    // STOP
                    if (!isVisible && wasVisible) {
                        activeSet.current.delete(id)

                        const start = visibleMap.current.get(id)
                        if (!start) return

                        const duration = now - start

                        if (duration > 700) {
                            onViewEnd(id,  Math.floor((now - start) / 1000))
                        }

                        visibleMap.current.delete(id)
                    }
                })
            },
            {
                threshold: [0, 0.6]
            }
        )

        return () => {
            observerRef.current?.disconnect()

            const now = Date.now()
            visibleMap.current.forEach((start, id) => {
                const duration = now - start
                if (duration > 500) {
                    onViewEnd(id, duration)
                }
            })
            visibleMap.current.clear()
        }
    }, [onViewEnd])


    const observe = useCallback((el: HTMLElement | null) => {
        if (!el || !observerRef.current) return
        observerRef.current.observe(el)
    }, [])

    const unobserve = useCallback((el: HTMLElement | null) => {
        if (!el || !observerRef.current) return
        observerRef.current.unobserve(el)
    }, [])

    return { observe, unobserve }
}