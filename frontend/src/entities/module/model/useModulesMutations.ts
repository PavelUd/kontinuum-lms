import {useEntityMutations} from "@/shared/lib/store/useEntityMutations";
import {createModule, deleteModule, setModuleStatus} from "@/entities/module/api/module.api";
import {ModuleSummary} from "@/entities/module";

export const useModulesMutations = (courseId : string) =>
    useEntityMutations<ModuleSummary>({
        queryKey: ["modules", courseId],
        createFn: createModule,
        deleteFn: deleteModule,
        setStatusFn: setModuleStatus,
        sortFn: sortModules
    })

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
