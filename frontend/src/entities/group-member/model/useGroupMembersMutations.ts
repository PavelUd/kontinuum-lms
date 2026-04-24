import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {addGroupMember, deleteGroupMember} from "@/entities/group-member/api/group-members.api";
import {GroupMember} from "@/entities/group-member/model/types";

export const useGroupMembersMutations = () => {
    return usePaginatedEntityMutations<GroupMember>({
        queryKey: ['group-members'],
        createFn: addGroupMember,
        deleteFn: (id: string) =>  deleteGroupMember("1" ,id),
        removeCacheKeys: [["students"], ['groups', 'available-lookup'], ["groups"]]
    })
}