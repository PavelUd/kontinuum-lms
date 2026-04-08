import {User} from "@/entities/user/models/types";
import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {createEmployee, deleteEmployee} from "@/entities/user/api/employee.api";

export const useEmployeeMutations = (page : number, pageSize: number) => {
    return usePaginatedEntityMutations<User>({
        queryKey: ['employees'],
        createFn: createEmployee,
        deleteFn: deleteEmployee,
        removeCacheKeys: [["employees_lookup"]]
    })
}