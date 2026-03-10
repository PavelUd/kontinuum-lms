'use client'

import { CourseSummary } from '../model/types'
import { SteppedProgress } from '@/shared/ui/stepped-progress/'
import {BookOpen } from 'lucide-react'

interface Props {
    course: CourseSummary,
    onOpen: () => void,
}

export function CourseCard({ course, onOpen }: Props) {


    const percent = Math.round(
        ((1) / course.lessonsCount) * 100
    )

    return (
        <div className="k-course-card cursor-pointer" onClick={onOpen}>
            <div className="k-card-placeholder">
                <BookOpen size={36} className="text-primary opacity-25; color: accent-amber-300" />
            </div>

            <h3 className="k-course-title">{course.name}</h3>

            <div>
                <div className="k-progress-info">
                  <span>
                    Модуль {1} из {course.lessonsCount}
                  </span>
                  <span className="font-bold text-text">{percent}%</span>
                </div>

                <SteppedProgress
                    total={100}
                    current={9}
                    currentProgress={30}
                />
            </div>
        </div>
    )
}