import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {Group} from "@/entities/group/module/types";
import {createGroup, deleteGroup} from "@/entities/group/api/groups.api";

export const useGroupMutations = () => {
    return usePaginatedEntityMutations<Group>({
        queryKey: ['groups'],
        createFn: createGroup,
        deleteFn: deleteGroup,
    })
}