import {useQuery} from "@tanstack/react-query";
import {ApiResponse} from "@/shared/api/types/api-response";
import {getAvailableModules, getModuleById, getModules} from "@/entities/module/api/module.api";
import {ModuleSummary} from "@/entities/module";

export function useModuleQuery(id: string) {
    return useQuery<ApiResponse<ModuleSummary>>({
        queryKey: ['module', id],
        queryFn: () => getModuleById(id),
        enabled: !!id
    })
}

export function useAvailableModulesQuery(courseId: string) {

    return useQuery<ApiResponse<ModuleSummary[]>>({
        queryKey: ['modules', courseId],
        queryFn: () => getAvailableModules(courseId),
        enabled: !!courseId
    })
}

export function useModulesQuery(courseId: string) {

    return useQuery<ApiResponse<ModuleSummary[]>>({
        queryKey: ['modules', courseId],
        queryFn: () => getModules(courseId),
        enabled: !!courseId
    })
}