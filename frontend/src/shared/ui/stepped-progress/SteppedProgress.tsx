'use client'

export function SteppedProgress({total, current, currentProgress,}: {
    total: number
    current: number
    currentProgress: number
}) {
    return (
        <div className="k-steps" aria-label="Прогресс по модулям">
            {Array.from({ length: total }).map((_, i) => {
                const step = i + 1

                if (step < current) {
                    return <div key={step} className="k-step-dot k-step-done" />
                }

                if (step === current) {
                    return (
                        <div key={step} className="k-step-bar" title={`Модуль ${step}: в процессе`}>
                            <div className="k-step-fill" style={{ width: `${currentProgress}%` }} />
                        </div>
                    )
                }

                return <div key={step} className="k-step-dot k-step-future" />
            })}
        </div>
    )
}