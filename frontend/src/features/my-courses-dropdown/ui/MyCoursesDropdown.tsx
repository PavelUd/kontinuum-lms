'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Layout } from 'lucide-react'
import styles from '@/shared/ui/dropdown/Dropdown.module.css'
import {CourseSummary} from "@/entities/course";
import {CourseModulesModal} from "@/features/course-modal/ui/CourseModulesModal";


type Props = {
    courses : CourseSummary[]
}


export function MyCoursesDropdown({ courses }: Props) {

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
            <Menu as="div" className={styles.dropdown}>

                <Menu.Button className="flex items-center gap-2 font-semibold cursor-pointer me-3">
                    <Layout size={24} />
                    <span className="text-xl font-semibold tracking-tight">
                        Мои курсы
                    </span>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                >
                    <Menu.Items className={styles.dropdownMenu}>
                        {courses.map((c) => (
                            <Menu.Item key={c.id}>
                                {({ active }) => (
                                    <div
                                        onClick={() => openModal(c.id)}
                                        className={`${styles.dropdownItem} ${active ? styles.active : ''}`}
                                    >
                                        {c.name}
                                    </div>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>

            </Menu>

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