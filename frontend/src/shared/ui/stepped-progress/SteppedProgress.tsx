type Props = {
    progress: number
    width?: number | string   // 180 | "100%" | "50%" | "flex"
    height?: number
}

export function SteppedProgress({
                                    progress,
                                    width = "100%",
                                    height = 8
                                }: Props) {
    const safeProgress = Math.max(0, Math.min(100, progress || 0))

    const isFlex = width === "flex"

    return (
        <div
            className={`bg-gray-200 rounded-full overflow-hidden ${isFlex ? "flex-1" : ""}`}
            style={{
                width: typeof width === "number" ? `${width}px` : isFlex ? undefined : width,
                height: `${height}px`
            }}
        >
            <div
                className="h-full transition-all duration-300"
                style={{
                    width: `${safeProgress}%`,
                    background: "linear-gradient(135deg, #00ff88, #00bd65)"
                }}
            />
        </div>
    )
}