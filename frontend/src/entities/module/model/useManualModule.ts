import {useEffect, useState} from "react"
import {getModuleById} from "@/entities/module/api/module.api";
import {Module} from "@/entities/module";
import {queryClient} from "@/shared/api";

export function useManualModule(id: string) {
    const [data, setData] = useState<Module | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!id) return

        let isActive = true

        setIsLoading(true)
        setIsError(false)

        getModuleById(id)
            .then((res) => {
                if (!isActive) return
                setData(res?.data)
                queryClient.removeQueries({
                    queryKey: ['module', id],
                    exact: true
                })
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