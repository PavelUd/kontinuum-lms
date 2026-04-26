import {PagedResult} from "@/shared/ui/pagination/types";
import {api} from "@/shared/api";
import {Group, GroupPreview, GroupRequest} from "@/entities/group/module/types";
import {ApiResponse} from "@/shared/api/types/api-response";

export const getGroups = async(page : number, pageSize: number, courseId: string, teacherId: string) : Promise<PagedResult<Group>> => {
    return await api.get<PagedResult<Group>>(`/groups?Page=${page}&PageSize=${pageSize}&CourseId=${courseId}&TeacherId=${teacherId}`, {auth: true})
}

export const getGroup = async(id: string) : Promise<Group> => {
    return await api.get<Group>(`/groups/${id}`, {auth: true})
}

export const createGroup = async(request : GroupRequest) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/groups`,request, {auth: true})
}

export const deleteGroup = async(id: string) : Promise<void> => {
    return await api.delete<void>(`/groups/${id}`, {auth: true})
}

export const updateGroup = async(id: string, data: Partial<Group>) : Promise<void> => {
    return await api.patch<void>(`/groups/${id}`, data, {auth: true})
}

export const changeGroupCurator = (groupId: string, curatorId: string) => {
    return api.patch(`/groups/${groupId}/members/curator/${curatorId}`,{},{auth: true})
}

export const getAvailableGroupsLookup = async(courseId? : string, userId? : string) : Promise<GroupPreview[]> => {
    return await api.get<GroupPreview[]>(`/groups/lookup/available?courseId=${courseId}&userId=${userId}`, {auth: true})
}
