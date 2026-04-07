import {useEffect, useRef, useState} from "react"
import {PagedResult} from "@/shared/ui/pagination/types";

type UseSafePaginationParams<T> = {
    data?: PagedResult<T>
    isLoading: boolean
    page: number
    setPage: (page: number) => void
}

export function useSafePagination<T>({
                                         data,
                                         isLoading,
                                         page,
                                         setPage
                                     }: UseSafePaginationParams<T>) {

    const isDeletingRef = useRef(false)
    const [stableTotalPages, setStableTotalPages] = useState(1)


    useEffect(() => {
        if (!isLoading && data?.totalPages) {
            setStableTotalPages(data.totalPages)
        }
    }, [data?.totalPages, isLoading])


    useEffect(() => {
        if (!data || isLoading) return
        if (!isDeletingRef.current) return

        const totalPages = data.totalPages ?? 1

        let nextPage = page

        if (page > totalPages) {
            nextPage = totalPages
        } else if (data.items.length === 0 && page > 1) {
            nextPage = page - 1
        }

        if (nextPage !== page) {
            setPage(nextPage)
        }

        isDeletingRef.current = false

    }, [data, page, isLoading])

    const markDeleting = () => {
        isDeletingRef.current = true
    }

    return {
        stableTotalPages,
        markDeleting
    }
}