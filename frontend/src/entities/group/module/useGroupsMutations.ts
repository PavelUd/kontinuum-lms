import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {Group} from "@/entities/group/module/types";
import {changeGroupCurator, createGroup, deleteGroup, updateGroup} from "@/entities/group/api/groups.api";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export const useGroupMutations = () => {
    return usePaginatedEntityMutations<Group>({
        queryKey: ['groups'],
        createFn: createGroup,
        deleteFn: deleteGroup,
        updateFn: updateGroup,
        removeCacheKeys : [["groups"]]
    })
}

export const useChangeCuratorMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ groupId, curatorId }: { groupId: string, curatorId: string }) =>
            changeGroupCurator(groupId, curatorId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        }
    })
}