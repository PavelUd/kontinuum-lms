import {useEffect, useRef} from "react";

export function useBlocksObserver(onView: (id: string) => void) {
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.6) {
                    const id = entry.target.getAttribute("data-id")
                    if (id) onView(id)
                }
            })
        }, { threshold: 0.6 })

        return () => observerRef.current?.disconnect()
    }, [])

    return observerRef
}