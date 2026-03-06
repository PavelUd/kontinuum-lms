import {useQuery} from "@tanstack/react-query";
import {ApiResponse} from "@/shared/api/types/api-response";
import {getModuleById} from "@/entities/module/api/module.api.ts";
import {Module} from "@/entities/module";

export function useModuleQuery(id: string) {
    return useQuery<ApiResponse<Module>>({
        queryKey: ['module', id],
        queryFn: () => getModuleById(id),
        enabled: !!id
    })
}