import {useEntityMutations} from "@/shared/lib/store/useEntityMutations";
import {CourseSummary} from "@/entities/course";
import {createCourse, deleteCourse, setStatus} from "@/entities/course/api/course.api";

export const useCourseMutations = () =>
 useEntityMutations<CourseSummary>({
    queryKey: ["courses"],
    createFn: createCourse,
    deleteFn: deleteCourse,
    setStatusFn: setStatus
})

