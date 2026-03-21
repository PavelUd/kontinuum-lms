import {CourseSummary} from "@/entities/course";
import {Status} from "@/entities/course/model/types";
import {setStatus} from "@/entities/course/api/course.api";
import {createEntityStore} from "@/shared/lib/store/createEntityStore";

export const useCourseStore = createEntityStore<CourseSummary, Status>({
    create: async () => {},
    remove: async () => {},
    updateStatus: (id, status) => setStatus(id, { status }),

    getTempItem: (course) => ({
        id: crypto.randomUUID(),
        name: course.name ?? "Новый курс",
        status: course.status ?? "archived",
        lessonsCount: 0,
        avatarUrl: "",
    }),
})