import {ApiResponse} from "@/shared/api/types/api-response";
import {api} from "@/shared/api";
import {InviteLink, User, UserLookup, UserRequest} from "@/entities/user/models/types";
import {PagedResult} from "@/shared/ui/pagination/types";

export const getEmployees = async(page : number, pageSize: number) : Promise<PagedResult<User>> => {
    return await api.get<PagedResult<User>>(`/employees?Page=${page}&PageSize=${pageSize}`, {auth: true})
}

export const getEmployeesLookup = async() : Promise<UserLookup[]> => {
    return await api.get<UserLookup[]>(`/employees/lookup`, {auth: true})
}

export const createEmployee = async(request : UserRequest) : Promise<ApiResponse<InviteLink>> => {
    return await api.post<ApiResponse<InviteLink>>(`/employees`,request, {auth: true})
}

export const deleteEmployee = async(id: string) : Promise<void> => {
    return await api.delete<void>(`/employees/${id}`, {auth: true})
}