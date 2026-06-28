import {useMutation, useQueryClient} from "@tanstack/react-query"
import {ApiResponse} from "@/shared/api/types/api-response";
import {EntityConfig, Optimistic} from "@/shared/lib/mutations/types";
import { v4 as uuidv4 } from 'uuid';


export function useEntityMutations<T extends { id: string }>(config: EntityConfig<T>) {
    const queryClient = useQueryClient()

    // CREATE
    const create = useMutation({
        mutationFn: config.createFn!,
        onMutate: async (data: Partial<T>) => {

            const applySort = (items: T[]) =>
                config.sortFn ? config.sortFn(items) : items

            await queryClient.cancelQueries({ queryKey: config.queryKey })

            const prev = queryClient.getQueryData<any>(config.queryKey)

            const temp: Optimistic<T> = {
                id: uuidv4(),
                __temp: true,
                ...data
            } as Optimistic<T>

            queryClient.setQueryData(config.queryKey, (old: any) => {
                const updated = [...(old?.data ?? []), temp]

                return {
                    ...old,
                    data: applySort(updated)
                }
            })

            return { prev, tempId: temp.id }
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSuccess: () => {
            config.removeCacheKeys?.forEach((key) => {
                queryClient.removeQueries({ queryKey: key })
            })
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: config.queryKey,
                refetchType: "active"
            })
        }
    })

    // DELETE
    const remove = useMutation({
        mutationFn: config.deleteFn!,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["courses"] })

            const prevResponse = queryClient.getQueryData<ApiResponse<any>>(config.queryKey)
            const prev = prevResponse?.data


            queryClient.setQueryData(config.queryKey, (old: any) => ({
                ...old,
                data: old.data.filter((i: T) => i.id !== id)
            }))

            return { prev }
        },

        onError: (_err, _id, ctx) => {
            queryClient.setQueryData(config.queryKey, ctx?.prev)
        },

        onSuccess: () => {
            config.removeCacheKeys?.forEach((key) => {
                queryClient.removeQueries({ queryKey: key })
            })
        },

        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: config.queryKey,
                refetchType: "active"
            })
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

        isCreating: create.isPending,
        isDeleting: remove.isPending,
        isUpdating: update.isPending,
    }
}