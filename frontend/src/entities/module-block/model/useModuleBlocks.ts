import {useCallback, useEffect, useState} from "react"
import {getModuleBlocks} from "@/entities/module-block/api/module-block.api";
import {ModuleBlock} from "@/entities/module-block/model/types";

export function useModuleBlocks(id: string) {
    const [data, setData] = useState<ModuleBlock<any>[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const fetchBlocks = useCallback(async () => {
        if (!id) return

        setIsLoading(true)
        setIsError(false)

        try {
            const res = await getModuleBlocks(id)
            setData(res?.data ?? [])
        } catch {
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchBlocks()
    }, [fetchBlocks])

    return {
        data,
        isLoading,
        isError,
        refetch: fetchBlocks,
    }
}