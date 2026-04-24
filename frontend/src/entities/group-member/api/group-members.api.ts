import {api} from "@/shared/api";
import {PagedResult} from "@/shared/ui/pagination/types";
import {CreateGroupMemberRequest, GroupMember} from "@/entities/group-member/model/types";
import {ApiResponse} from "@/shared/api/types/api-response";

export const getGroupMembers = async(page : number, pageSize: number,id: string) : Promise<PagedResult<GroupMember>> => {
    return await api.get<PagedResult<GroupMember>>(`/groups/${id}/members?Page=${page}&PageSize=${pageSize}`, {auth: true})
}

export const deleteGroupMember = async(groupId: string, id : string) : Promise<void> => {
    return await api.delete<void>(`/groups/${groupId}/members/${id}`, {auth: true})
}

export const addGroupMember = async(request : CreateGroupMemberRequest) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/groups/${request.groupId}/members`,{ "userId" : request.userId}, {auth: true})
}