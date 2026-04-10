import {PagedResult} from "@/shared/ui/pagination/types";
import {CreateStudentRequest, Student} from "@/entities/user/models/types";
import {api} from "@/shared/api";
import {ApiResponse} from "@/shared/api/types/api-response";

export const getStudents = async(page : number, pageSize: number) : Promise<PagedResult<Student>> => {
    return await api.get<PagedResult<Student>>(`/students?Page=${page}&PageSize=${pageSize}`, {auth: true})
}

export const createStudent = async(request : CreateStudentRequest) : Promise<ApiResponse<string>> => {
    return await api.post<ApiResponse<string>>(`/students`,request, {auth: true})
}

export const deleteStudent = async(id: string) : Promise<void> => {
    return await api.delete<void>(`/students/${id}`, {auth: true})
}