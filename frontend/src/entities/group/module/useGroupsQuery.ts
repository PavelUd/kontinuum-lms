import {useQuery} from "@tanstack/react-query";
import {PagedResult} from "@/shared/ui/pagination/types";
import {keepPreviousData} from "@tanstack/query-core";
import {getAvailableGroupsLookup, getGroup, getGroups} from "@/entities/group/api/groups.api";
import {Group, GroupPreview} from "@/entities/group/module/types";

export const useGroupsQuery = (page :  number, pageSize : number, courseId: string, teacherId: string) => {
    return useQuery<PagedResult<Group>>({
        queryKey: ['groups', page, pageSize, courseId, teacherId],
        queryFn: () => getGroups(page, pageSize, courseId, teacherId),
        placeholderData: keepPreviousData
    });
}

export const useGroupQuery = (id : string) => {
    return useQuery<Group>({
        queryKey: ['groups', id],
        queryFn: () => getGroup(id),
        placeholderData: keepPreviousData
    });
}

export function useAvailableGroupsLookup(courseId?: string, userId?: string) {
    return useQuery<GroupPreview[]>({
        queryKey: ['groups', 'available-lookup', courseId, userId],
        queryFn: () => getAvailableGroupsLookup(courseId, userId),
        enabled: !!courseId
    });
}