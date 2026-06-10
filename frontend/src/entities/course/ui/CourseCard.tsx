'use client'

import { CourseSummary } from '../model/types'
import { SteppedProgress } from '@/shared/ui/stepped-progress/'
import {BookOpen } from 'lucide-react'
import { plural } from "@/shared/lib/plural/plural";
import Skeleton from "react-loading-skeleton";
import {useCourseProgressQuery} from "@/entities/progress/model/useProggressQuery";
import {Progress} from "@/entities/progress/model/progress.service";

interface Props {
    course: CourseSummary,
    onOpen: () => void,
}

export function CourseCard({ course, onOpen }: Props) {

    const {data: progressData, isLoading: isProgressLoading} = useCourseProgressQuery(course.id);
    const progress = !isProgressLoading && progressData
        ? Progress.getCourseProgress(progressData, course.lessonsCount)
        : null

    return (
        <div className="k-course-card cursor-pointer" onClick={onOpen}>
            <div className="k-card-placeholder">
                <img src={course.avatarUrl} className="h-full w-full rounded-xl object-cover"></img>
                <BookOpen size={36} className="text-primary opacity-25; color: accent-amber-300" />
            </div>

            <h3 className="k-course-title">{course.name}</h3>

                {isProgressLoading ? (
                    <Skeleton className="k-progress-info" />
                ) : (
                    <div>
                        <div className="k-progress-info">
                          <span>
                            {course.lessonsCount} {plural(course.lessonsCount, "модуль", "модуля", "модулей")}
                          </span>
                            <span className="font-bold text-text">{Math.round(progress ?? 0)}%</span>
                        </div>
                    <SteppedProgress
                        progress={progress ?? 0}
                    />
                    </div>
                )}
        </div>
    )
}