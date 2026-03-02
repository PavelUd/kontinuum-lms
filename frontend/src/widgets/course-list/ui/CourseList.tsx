'use client'

import { CourseCard } from '@/entities/course'
import { useCoursesQuery } from '@/entities/course/model/useCoursesQuery'

export const CourseList = () => {
    const { data, isLoading, isError, error } = useCoursesQuery()

    if (isLoading) return <div className="text-muted">Загрузка курсов…</div>

    if (isError) {
        const message = error instanceof Error ? error.message : 'Ошибка загрузки'
        return <div className="text-red-600">Ошибка: {message}</div>
    }

    const courses = data?.data ?? []
    if (courses.length === 0) return <div className="text-muted">Курсы пока не найдены.</div>;
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}