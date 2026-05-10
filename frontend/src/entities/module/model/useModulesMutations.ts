import {useEntityMutations} from "@/shared/lib/mutations/useEntityMutations";
import {
    createModule,
    deleteModule,
    setModuleStatus
} from "@/entities/module/api/module.api";
import {ModuleSummary} from "@/entities/module";
import {useChangeStatusMutation} from "@/shared/lib/mutations/useChangeStatusMutation";
import {CourseSummary} from "@/entities/course";

export const useModulesMutations = (courseId : string) => {
    const baseMutations = useEntityMutations<ModuleSummary>({
        queryKey: ["modules", courseId],
        createFn: createModule,
        deleteFn: deleteModule,
        sortFn: sortModules,
        removeCacheKeys: [["courses"]]

    })

    const changeStatusMutations = useChangeStatusMutation<CourseSummary>({
        queryKey: ["modules", courseId],
        mutationFn: setModuleStatus
    })

    return {
        ...baseMutations,
        ...changeStatusMutations
    }

}

function sortModules<T extends { orderIndex?: number; __temp?: boolean }>(items: T[]) {
    const getOrder = (m: T) => m.orderIndex ?? Number.MAX_SAFE_INTEGER

    return [...items].sort((a, b) => {
        if (getOrder(a) !== getOrder(b)) {
            return getOrder(a) - getOrder(b)
        }

        if (a.__temp && !b.__temp) return -1
        if (!a.__temp && b.__temp) return 1

        return 0
    })
}
