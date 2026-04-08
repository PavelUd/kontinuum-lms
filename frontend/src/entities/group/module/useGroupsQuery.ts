import {useQuery} from "@tanstack/react-query";
import {PagedResult} from "@/shared/ui/pagination/types";
import {keepPreviousData} from "@tanstack/query-core";
import {getGroups} from "@/entities/group/api/groups.api";

export const useGroupsQuery = (page :  number, pageSize : number, courseId: string, teacherId: string) => {
    return useQuery<PagedResult<Group>>({
        queryKey: ['groups', page, pageSize, courseId, teacherId],
        queryFn: () => getGroups(page, pageSize, courseId, teacherId),
        placeholderData: keepPreviousData
    });
}