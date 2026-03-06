'use client'

import {useCoursesQuery} from "@/entities/course";
import {Loader} from "@/shared/ui/loader";
import {CoursesPage} from "@/pages/courses/CoursesPage";

export default function HomePage() {
    const { data, isLoading, isError } = useCoursesQuery()

    if (isLoading) return <Loader />
    if (isError) return <div>Ошибка загрузки</div>

    const courses = data?.data ?? []

    return (
        <CoursesPage
            userName="Николай"
            userEmail="nikolai@example.com"
            streak={12}
            courses={courses}
        />
    )
}