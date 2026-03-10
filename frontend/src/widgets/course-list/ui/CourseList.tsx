'use client'

import { useState } from 'react'
import {CourseCard, CourseSummary} from '@/entities/course'
import {CourseModulesModal} from "@/features/course-modal/ui/CourseModulesModal";

type Props = {
    courses : CourseSummary[]
}

export const CourseList = ({ courses } : Props) => {


    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    function openModal(courseId: string) {
        setSelectedCourseId(courseId)
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)

        setTimeout(() => {
            setSelectedCourseId(null)
        }, 200)
    }

    return (
        <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onOpen={() => openModal(course.id)}
                    />
                ))}

            </div>

            {selectedCourseId && (
                <CourseModulesModal
                    open={isOpen}
                    courseId={selectedCourseId}
                    onClose={closeModal}
                />
            )}
        </>
    )
}