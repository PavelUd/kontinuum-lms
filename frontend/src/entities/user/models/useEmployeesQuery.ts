import {useQuery} from '@tanstack/react-query'
import {getEmployees} from "@/entities/user/api/employee.api";
import {PagedResult} from "@/shared/ui/pagination/types";
import {User} from "@/entities/user/models/types";
import {keepPreviousData} from "@tanstack/query-core";

export const useEmployeesQuery = (page :  number, pageSize : number) => {
    return useQuery<PagedResult<User>>({
        queryKey: ['employees', page, pageSize],
        queryFn: () => getEmployees(page, pageSize),
        placeholderData: keepPreviousData
    });
}