import {useEntityMutations} from "@/shared/lib/mutations/useEntityMutations";
import {CourseSummary} from "@/entities/course";
import {createCourse, deleteCourse, setStatus} from "@/entities/course/api/course.api";
import {useChangeStatusMutation} from "@/shared/lib/mutations/useChangeStatusMutation";

export const useCourseMutations = () => {
    const baseMutations = useEntityMutations<CourseSummary>({
        queryKey: ["courses"],
        createFn: createCourse,
        deleteFn: deleteCourse,
    })

    const changeStatusMutations = useChangeStatusMutation<CourseSummary>({
        queryKey: ["courses"],
        mutationFn: setStatus
    })

    return {
        ...baseMutations,
        ...changeStatusMutations,
    }

}

