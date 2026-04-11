import {useQuery} from "@tanstack/react-query";
import {PagedResult} from "@/shared/ui/pagination/types";
import {keepPreviousData} from "@tanstack/query-core";
import {getStudents} from "@/entities/user/api/students.api";
import {Student} from "@/entities/user/models/types";

export const useStudentsQuery = (page :  number, pageSize : number, studentSearch : string, filterGrade : string, filterStatus : string) => {
    return useQuery<PagedResult<Student>>({
        queryKey: ['students', page, pageSize, studentSearch, filterGrade, filterStatus],
        queryFn: () => getStudents(page, pageSize, studentSearch, filterGrade, filterStatus),
        placeholderData: keepPreviousData
    });
}