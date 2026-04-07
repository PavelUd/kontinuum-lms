import {useMutation, useQueryClient} from "@tanstack/react-query"
import { EntityConfig } from "./types"
import {PagedResult} from "@/shared/ui/pagination/types";


export function usePaginatedEntityMutations<T extends { id: string }>(
    config: EntityConfig<T>
) {
    const queryClient = useQueryClient()

    const create = useMutation({
        mutationFn: config.createFn!,

        onSuccess: () => {
            config.removeCacheKeys?.forEach((key) => {
                queryClient.removeQueries({ queryKey: key })
            })

            queryClient.invalidateQueries({
                queryKey: config.queryKey
            })
        }
    })

    const remove = useMutation({
        mutationFn: config.deleteFn!,

        onSuccess: () => {
            config.removeCacheKeys?.forEach((key) => {
                queryClient.removeQueries({ queryKey: key })
            })

            queryClient.invalidateQueries({
                queryKey: config.queryKey
            })
        }
    })

    const update = useMutation({
        mutationFn: ({id, patch}: { id: string; patch: Partial<T> }) =>
            config.updateFn!(id, patch),

        onMutate: async ({id, patch}) => {

            await queryClient.cancelQueries({queryKey: config.queryKey})

            const prev = queryClient.getQueryData<PagedResult<T>>(config.queryKey)

            queryClient.setQueryData(config.queryKey, (old : any) => {
                if (!old) return old

                return {
                    ...old,
                    items: old.items.map((item) =>
                        item.id === id ? {...item, ...patch} : item
                    )
                }
            })

            return {prev}
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) {
                queryClient.setQueryData(config.queryKey, ctx.prev)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: config.queryKey
            })

        }
        })
            return {
        create: create.mutateAsync,
        remove: remove.mutateAsync,
        update: update.mutateAsync,

        isCreating: create.isPending,
        isDeleting: remove.isPending,
        isUpdating: update.isPending
    }
}