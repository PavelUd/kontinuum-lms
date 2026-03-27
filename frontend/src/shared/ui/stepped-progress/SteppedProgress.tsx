'use client'

export function SteppedProgress({progress}: {
    progress: number
}) {
    return (
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full transition-all"
                style={{
                    width: `${progress}%`,
                    background: "linear-gradient(135deg, #00ff88, #00bd65)"
                }}
            />
        </div>
    )
}