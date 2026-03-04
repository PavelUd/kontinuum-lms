'use client'

import { CourseList } from '@/widgets/course-list/ui/CourseList'
import { Header } from '@/widgets/header/ui/Header'
import {useCoursesQuery} from "@/entities/course";
import {Loader} from "@/shared/ui/loader";

export default function HomePage() {

    const { data, isLoading, isError } = useCoursesQuery()
    const courses = data?.data ?? []

    if (isLoading) return <Loader />
    if (isError) return <div>Ошибка загрузки</div>

    return (
        <>
            <Header
                userName="Николай"
                userEmail="nikolai@example.com"
                streak={12}
                courses={courses}
            />

            <main className="max-w-[1800px] mx-auto px-6 md:px-10 xl:px-16 p py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Мои курсы
                    </h1>
                </div>

                <CourseList courses={courses} />
            </main>
        </>
    )
}