import {useEffect, useState} from "react"
import {getModuleBlocks} from "@/entities/module-block/api/module-block.api";
import {ModuleBlock} from "@/entities/module-block/model/types";

export function useModuleBlocks(id: string) {
    const [data, setData] = useState<ModuleBlock<any>[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!id) return

        let isActive = true

        setIsLoading(true)
        setIsError(false)

        getModuleBlocks(id)
            .then((res) => {
                if (!isActive) return
                setData(res?.data ?? [])
            })
            .catch(() => {
                if (!isActive) return
                setIsError(true)
            })
            .finally(() => {
                if (!isActive) return
                setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [id])

    return { data, isLoading, isError }
}