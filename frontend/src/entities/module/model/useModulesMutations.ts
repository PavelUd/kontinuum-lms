import {useEntityMutations} from "@/shared/lib/store/useEntityMutations";
import {createModule, deleteModule, setModuleStatus} from "@/entities/module/api/module.api";
import {ModuleSummary} from "@/entities/module";

export const useModulesMutations = () =>
    useEntityMutations<ModuleSummary>({
        queryKey: ["modules"],
        createFn: createModule,
        deleteFn: deleteModule,
        setStatusFn: setModuleStatus
    })