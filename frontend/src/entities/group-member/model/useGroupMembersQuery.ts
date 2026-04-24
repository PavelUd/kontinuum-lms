import {useQuery} from "@tanstack/react-query";
import {PagedResult} from "@/shared/ui/pagination/types";
import {keepPreviousData} from "@tanstack/query-core";
import {getGroupMembers} from "@/entities/group-member/api/group-members.api";
import {GroupMember} from "@/entities/group-member/model/types";

export const useGroupMembersQuery = (page :  number, pageSize : number, groupId : string) => {
    return useQuery<PagedResult<GroupMember>>({
        queryKey: ['group-members', page, pageSize, groupId],
        queryFn: () => getGroupMembers(page, pageSize, groupId),
        placeholderData: keepPreviousData
    });
}