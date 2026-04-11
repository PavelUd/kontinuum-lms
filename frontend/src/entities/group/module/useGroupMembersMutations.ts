import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {GroupMember} from "@/entities/group/module/types";
import {addGroupMember, deleteGroup} from "@/entities/group/api/groups.api";

export const useGroupMembersMutations = () => {
    return usePaginatedEntityMutations<GroupMember>({
        queryKey: ['group-members'],
        createFn: addGroupMember,
        deleteFn: deleteGroup,
        removeCacheKeys: [["students"], ['groups', 'available-lookup'], ["groups"]]
    })
}