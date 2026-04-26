import {ApiResponse} from "@/shared/api/types/api-response";

export type EntityWithId = {
    id: string
}

export type BaseState<T extends EntityWithId, TStatus> = {
    items: T[]
    isLoading: boolean
    error: string | null

    setItems: (items: T[]) => void
    add: (item: Partial<T>) => Promise<void>
    remove: (id: string) => Promise<void>
    updateStatus: (id: string, status: TStatus) => Promise<void>
    clear: () => void
}

export type StoreConfig<T, TStatus> = {
    create: (item: Partial<T>) => Promise<void>
    remove: (id: string) => Promise<void>
    updateStatus: (id: string, status: TStatus) => Promise<void>

    getTempItem: (item: Partial<T>) => T
}
export type Optimistic<T> = T & {
    __temp?: true
}

export type EntityConfig<T> = {
    queryKey: any[]
    createFn?: (data : any) => Promise<ApiResponse<any>>
    deleteFn?: (id: string) => Promise<void>
    updateFn?: (id: string, patch: Partial<T>) => Promise<void>,
    removeCacheKeys?: unknown[][],
    sortFn?: (items: T[]) => T[]
}