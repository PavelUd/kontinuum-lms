import {useMutation, useQueryClient} from "@tanstack/react-query";

type RemoveKeysConfig<TVars> =
    | unknown[][]
    | ((vars: TVars) => unknown[][])

type StatusMutationConfig<T> = {
    queryKey: unknown[]
    mutationFn: (id: string, status: any) => Promise<any>
    removeCacheKeys?: RemoveKeysConfig<{ id: string; status: string }>

}

export function useChangeStatusMutation<T extends { id: string }>(
    config: StatusMutationConfig<T>
) {

    const queryClient = useQueryClient()

    const setStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: any }) =>
            config.mutationFn(id, {status: status}),

        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: config.queryKey })

            const prev = queryClient.getQueryData<any>(config.queryKey)

            queryClient.setQueryData(config.queryKey, (old: any) => {
                if (!old?.data) return old

                return {
                    ...old,
                    data: old.data.map((item: T) =>
                        item.id === id ? { ...item, status } : item
                    )
                }
            })

            return { prev }
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) {
                queryClient.setQueryData(config.queryKey, ctx.prev)
            }
        },

        onSuccess: (_data, vars) => {
            let keys: unknown[][] = []

            if (Array.isArray(config.removeCacheKeys)) {
                keys = config.removeCacheKeys
            } else if (typeof config.removeCacheKeys === "function") {
                keys = config.removeCacheKeys(vars)
            }

            keys.forEach((key) => {
                queryClient.removeQueries({ queryKey: key })
            })
        }
    })

    return {
        setStatus: setStatus.mutateAsync
    }
}