import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ApiResponse} from "@/shared/api/types/api-response";
import {getModuleById, getModules} from "@/entities/module/api/module.api";
import {Module, ModuleSummary} from "@/entities/module";

export function useModuleQuery(id: string) {
    return useQuery<ApiResponse<Module>>({
        queryKey: ['module', id],
        queryFn: () => getModuleById(id),
        enabled: !!id
    })
}


export function useModulesQuery(courseId: string) {
    const queryClient = useQueryClient()

    return useQuery<ApiResponse<ModuleSummary[]>>({
        queryKey: ['modules'],

        queryFn: async () => {
            // 1. пробуем взять из кеша
            const cached = queryClient.getQueryData<ApiResponse<ModuleSummary[]>>(
                ['modules']
            )

            if (cached) {
                return cached
            }
            console.log(cached)
            const res = await getModules(courseId)

            return res
        },

        enabled: !!courseId
    })
}