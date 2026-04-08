import {PagedResult} from "@/shared/ui/pagination/types";
import {Group} from "./types"
import {api} from "@/shared/api";

export const getGroups = async(page : number, pageSize: number, courseId: string, teacherId: string) : Promise<PagedResult<Group>> => {
    return await api.get<PagedResult<User>>(`/groups?Page=${page}&PageSize=${pageSize}&CourseId=${courseId}&TeacherId=${teacherId}`, {auth: true})
}