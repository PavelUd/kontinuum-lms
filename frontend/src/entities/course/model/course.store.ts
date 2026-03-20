import {create} from "zustand";
import {CourseSummary} from "@/entities/course";
import {CourseStatus} from "@/entities/course/model/types";
import {setStatus} from "@/entities/course/api/course.api";

type CourseSummaryState = {
    courses: CourseSummary[]
    isLoading: boolean
    error: string | null

    setCourses: (courses: CourseSummary[]) => void
    addCourse: (course: Partial<CourseSummary>) => Promise<void>
    removeCourse: (id: string) => Promise<void>
    updateCourseStatus: (id: string, status: CourseStatus) => Promise<void>
    clear: () => void
}

export const useCourseStore = create<CourseSummaryState>((set, get) => ({
    courses: [],
    isLoading: false,
    error: null,

    setCourses: (courses) => set({ courses }),

    addCourse: async (course) => {
        set({ isLoading: true, error: null })

        const tempCourse: CourseSummary = {
            id: crypto.randomUUID(),
            name: course.name ?? "Новый курс",
            status: course.status ?? "archived",
            lessonsCount: 0,
            avatarUrl: ""
        }

        set((state) => ({
            courses: [tempCourse, ...state.courses],
        }))

        try {
            const created = ""
/*
            set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === tempCourse.id ? created : c
                ),
                isLoading: false,
            }))
            */
        } catch (e: any) {
            set((state) => ({
                courses: state.courses.filter((c) => c.id !== tempCourse.id),
                error: e.message,
                isLoading: false,
            }))
        }
    },

    removeCourse: async (id) => {
        set({ error: null })

        const prev = get().courses

        // optimistic remove
        set((state) => ({
            courses: state.courses.filter((c) => c.id !== id),
        }))

        try {
 //           await deleteCourse(id)
        } catch (e: any) {
            set({
                courses: prev,
                error: e.message,
            })
        }
    },

    updateCourseStatus: async (id, status) => {
        const prevCourses = get().courses

        set(state => ({
            courses: state.courses.map(c =>
                c.id === id ? { ...c, status } : c
            )
        }))

        try {
            await setStatus(id, {status : status})
        } catch (e) {
            set({ courses: prevCourses, error: "Не удалось обновить статус" })
        }
    },

    clear: () => set({ courses: [] }),
}))