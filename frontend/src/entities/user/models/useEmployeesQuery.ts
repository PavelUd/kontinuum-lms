import {useQuery} from '@tanstack/react-query'
import {getEmployees, getEmployeesLookup} from "@/entities/user/api/employee.api";
import {PagedResult} from "@/shared/ui/pagination/types";
import {User, UserLookup} from "@/entities/user/models/types";
import {keepPreviousData} from "@tanstack/query-core";

export const useEmployeesQuery = (page :  number, pageSize : number) => {
    return useQuery<PagedResult<User>>({
        queryKey: ['employees', page, pageSize],
        queryFn: () => getEmployees(page, pageSize),
        placeholderData: keepPreviousData
    });
}

export const useEmployeesLookupQuery = () => {
    return useQuery<UserLookup[]>({
        queryKey: ['employees_lookup'],
        queryFn: getEmployeesLookup,
    })
}