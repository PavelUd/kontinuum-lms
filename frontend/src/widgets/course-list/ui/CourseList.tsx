'use client'

import { useState } from 'react'
import { CourseCard } from '@/entities/course'
import { useCoursesQuery } from '@/entities/course/model/useCoursesQuery'
import { Loader } from '@/shared/ui/loader/Loader'
import {CourseModulesModal} from "@/features/course-modal/ui/CourseModulesModal";

export const CourseList = () => {

    const { data, isLoading, isError } = useCoursesQuery()
    const courses = data?.data ?? []

    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

    if (isLoading) return <Loader />
    if (isError) return <div>Ошибка загрузки</div>

    return (
        <>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onOpen={() => setSelectedCourseId(course.id)}
                    />
                ))}

            </div>

            {selectedCourseId && (
                <CourseModulesModal
                    open
                    courseId={selectedCourseId}
                    onClose={() => setSelectedCourseId(null)}
                />
            )}
        </>
    )
}