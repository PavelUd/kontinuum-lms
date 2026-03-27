import {useEffect} from "react";

export function usePageLeave(handler: () => void) {
    useEffect(() => {
        const onLeave = () => handler()
        const onVisibility = () => {
            if (document.visibilityState === "hidden")
            {
                handler()
            }
        }
        window.addEventListener("beforeunload", onLeave)
        document.addEventListener("visibilitychange", onVisibility)
        return () => {
            window.removeEventListener("beforeunload", onLeave)
            document.removeEventListener("visibilitychange", onVisibility)
        }
    }, [handler])
}