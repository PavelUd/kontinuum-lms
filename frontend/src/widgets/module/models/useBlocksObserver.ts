import {useEffect, useRef, useCallback, useMemo} from "react"

type Callback = (id: string, duration: number) => void

export function useBlocksObserver(onViewEnd: Callback) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const callbackRef = useRef(onViewEnd)

    const EXCLUDED_TYPES = useMemo(
        () => new Set(["openquestion", "choicequestion", "video", "audio"]),
        []
    )

    const visibleMap = useRef<Map<string, number>>(new Map())
    const activeSet = useRef<Set<string>>(new Set())

    // 🔥 обновляем callback
    useEffect(() => {
        callbackRef.current = onViewEnd
    }, [onViewEnd])

    // 🔥 observer создаётся 1 раз
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const now = Date.now()

                entries.forEach(entry => {
                    const id = entry.target.getAttribute("data-id")
                    const type = entry.target.getAttribute("data-type")

                    if (!id || !type) return
                    if (EXCLUDED_TYPES.has(type)) return

                    const isVisible = entry.intersectionRatio >= 0.6
                    const wasVisible = activeSet.current.has(id)

                    if (isVisible && !wasVisible) {
                        activeSet.current.add(id)
                        visibleMap.current.set(id, now)
                    }

                    if (!isVisible && wasVisible) {
                        activeSet.current.delete(id)

                        const start = visibleMap.current.get(id)
                        if (!start) return

                        const duration = now - start

                        if (duration > 700) {
                            callbackRef.current(id, Math.floor(duration / 1000))
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
                    callbackRef.current(id, duration)
                }
            })

            visibleMap.current.clear()
        }
    }, []) // ❗ пустой массив

    const observe = useCallback((el: HTMLElement | null) => {
        if (el && observerRef.current) {
            observerRef.current.observe(el)
        }
    }, [])

    const unobserve = useCallback((el: HTMLElement | null) => {
        if (el && observerRef.current) {
            observerRef.current.unobserve(el)
        }
    }, [])

    return { observe, unobserve }
}