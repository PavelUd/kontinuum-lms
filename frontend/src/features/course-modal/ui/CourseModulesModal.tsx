'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useCourseQuery } from '@/entities/course'
import { ModuleRow } from '@/entities/module'
import './CourseModulesModal.css'
import {Loader} from "@/shared/ui/loader";

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

    const { data: source } = useCourseQuery(courseId)

    const course= source?.data;

    return (
        <Transition show={open} as={Fragment}>

            <Dialog
                as="div"
                className="k-modal-root"
                onClose={onClose}
            >

                {/* overlay animation */}

                <Transition.Child
                    as={Fragment}
                    enter="transition duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition duration-150"
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
                                        {course?.name}
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

                                {course?.lessons?.map((module) => (
                                    <ModuleRow
                                        key={module.id}
                                        module={module}
                                    />
                                ))}

                            </div>

                        </Dialog.Panel>

                    </Transition.Child>

                </div>

            </Dialog>

        </Transition>
    )
}