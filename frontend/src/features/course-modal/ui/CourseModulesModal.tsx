'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useCourseQuery } from '@/entities/course'
import { ModuleRow } from '@/entities/module'
import './CourseModulesModal.css'
import Link from "next/link"
import {ModulesSkeleton} from "@/features/course-modal/ui/ModulesSkeleton";
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import {useModulesQuery} from "@/entities/module/model/useModulesQuery";
import { useCourseProgressQuery } from "@/entities/progress/model/useProggressQuery"

interface Props {
    open: boolean
    courseId: string
    onClose: () => void
}

export function CourseModulesModal({
                                       open,
                                       courseId,
                                       onClose
                                   }: Props) {

    const { data: source, isLoading: loading } = useCourseQuery(courseId)
    const { data: modulesData, isLoading: modulesLoading } = useModulesQuery(courseId)
    const {data: progressData, isLoading: progressLoading} =  useCourseProgressQuery(courseId);
    const course= source?.data;
    const lessons = modulesData?.data ?? []

    return (
        <Transition appear show={open} as={Fragment}>

            <Dialog
                as="div"
                className="k-modal-root"
                onClose={onClose}
            >

                {/* overlay animation */}

                <Transition.Child
                    as={Fragment}
                    enter="transition duration-5"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition duration-5"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="k-modal-overlay" />
                </Transition.Child>

                <div className="k-modal-container">

                    {/* modal animation */}

                    <Transition.Child
                        as={Fragment}
                        enter="k-modal-enter"
                        enterFrom="k-modal-enter-from"
                        enterTo="k-modal-enter-to"
                        leave="k-modal-leave"
                        leaveFrom="k-modal-leave-from"
                        leaveTo="k-modal-leave-to"
                    >

                        <Dialog.Panel className="k-modal">

                            <div className="k-modal-header">

                                <div>
                                    <Dialog.Title className="k-modal-title">
                                        {loading ? (
                                            <Skeleton width={520} height={38} />
                                        ) : (
                                            course?.name
                                        )}
                                    </Dialog.Title>

                                    <p className="k-modal-subtitle">
                                        Выберите модуль для продолжения
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="k-modal-close"
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="k-modules-list">

                                {modulesLoading && progressLoading ? (
                                    <ModulesSkeleton />
                                ) : (
                                    lessons.map((module, index) => {
                                        const progress = progressData?.find(x => x.lessonId == module.id);
                                        return (
                                        <Link
                                            key={`${module.id}-${index}`}
                                            href={`/courses/${course?.id}/module/${module.id}`}
                                        >
                                            <ModuleRow progress={progress?.progress} module={module} />
                                        </Link>
                                    )}
                                    )
                                )}

                            </div>

                        </Dialog.Panel>

                    </Transition.Child>

                </div>

            </Dialog>

        </Transition>
    )
}