import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"


export function ModulesSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                    <Skeleton
                        width={730}
                        height={70}
                        borderRadius={14}
                    />
                </div>
            ))}
        </>
    )
}