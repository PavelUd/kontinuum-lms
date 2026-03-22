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

    return useQuery<ApiResponse<ModuleSummary[]>>({
        queryKey: ['modules', courseId],
        queryFn: () => getModules(courseId),
        enabled: !!courseId
    })
}