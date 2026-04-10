import {useQuery} from "@tanstack/react-query";
import {PagedResult} from "@/shared/ui/pagination/types";
import {keepPreviousData} from "@tanstack/query-core";
import {getStudents} from "@/entities/user/api/students.api";
import {Student} from "@/entities/user/models/types";

export const useStudentsQuery = (page :  number, pageSize : number) => {
    return useQuery<PagedResult<Student>>({
        queryKey: ['students', page, pageSize],
        queryFn: () => getStudents(page, pageSize),
        placeholderData: keepPreviousData
    });
}