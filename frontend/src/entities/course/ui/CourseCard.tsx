'use client'

import { Course } from '../model/types'
import { SteppedProgress } from '@/shared/ui/SteppedProgress/'
import { Image as ImageIcon } from 'lucide-react'

interface Props {
    course: Course
}

export function CourseCard({ course }: Props) {

    console.log(course)
    const percent = Math.round(
        ((1) / course.lessonsCount) * 100
    )

    return (
        <div className="k-course-card">
            <div className="k-card-placeholder">
                <ImageIcon size={48} />
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
                    total={10}
                    current={10}
                    currentProgress={30}
                />
            </div>
        </div>
    )
}