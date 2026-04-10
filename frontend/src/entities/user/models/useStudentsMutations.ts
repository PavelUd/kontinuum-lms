import {usePaginatedEntityMutations} from "@/shared/lib/mutations/usePaginatedEntityMutations";
import {Student} from "@/entities/user/models/types";
import {createStudent, deleteStudent} from "@/entities/user/api/students.api";

export const useStudentMutations = () => {
    return usePaginatedEntityMutations<Student>({
        queryKey: ['students'],
        createFn: createStudent,
        deleteFn: deleteStudent,
    })
}