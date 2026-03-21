import {useMutation, useQueryClient} from "@tanstack/react-query"
import {ApiResponse} from "@/shared/api/types/api-response";



type EntityConfig<T> = {
    queryKey: string[]
    createFn?: (data : any) => Promise<ApiResponse<string>>
    deleteFn?: (id: string) => Promise<void>
    updateFn?: (id: string, patch: Partial<T>) => Promise<T>
    setStatusFn?: (id: string, status: any) => Promise<any>
}

export function useEntityMutations<T extends { id: string }>(config: EntityConfig<T>) {
    const queryClient = useQueryClient()

    // CREATE
    const create = useMutation({
        mutationFn: config.createFn!,
        onMutate: async (data: Partial<T>) => {
            await queryClient.cancelQueries({ queryKey: config.queryKey })

            const prev = queryClient.getQueryData<any>(config.queryKey)

            const temp: T = {
                id: crypto.randomUUID(),
                ...data
            } as T

            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: [temp, ...old.data]
            }))

            return { prev, tempId: temp.id }
        },

        onSuccess: (created, _vars, ctx) => {
            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: old.data.map((i: T) =>
                    i.id === ctx?.tempId ? created.data : i
                )
            }))
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })

    // DELETE
    const remove = useMutation({
        mutationFn: config.deleteFn!,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["courses"] })

            const prevResponse = queryClient.getQueryData<ApiResponse<any>>(config.queryKey)
            const prev = prevResponse?.data

            console.log(prev)
            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: old.data.filter((i: T) => i.id !== id)
            }))

            return { prev }
        },

        onError: (_err, _id, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })

    const setStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: any }) =>
            config.setStatusFn!(id, {status: status}),

        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: config.queryKey })

            const prev = queryClient.getQueryData<any>(config.queryKey)

            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: old.data.map((i: T) =>
                    i.id === id ? { ...i, status } : i
                )
            }))

            return { prev }
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: config.queryKey })
        }
    })

    // UPDATE (например статус)
    const update = useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<T> }) =>
            config.updateFn!(id, patch),

        onMutate: async ({ id, patch }) => {
            await queryClient.cancelQueries({ queryKey: ["courses"] })

            const prev = queryClient.getQueryData<any>(config.queryKey)

            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: old.data.map((i: T) =>
                    i.id === id ? { ...i, ...patch } : i
                )
            }))

            return { prev }
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })

    return {
        create: create.mutateAsync,
        remove: remove.mutateAsync,
        update: update.mutateAsync,
        setStatus: setStatus.mutateAsync,

        isCreating: create.isPending,
        isDeleting: remove.isPending,
        isUpdating: update.isPending,
    }
}