'use client'

import {Plus} from "lucide-react";
import styles from "./admin-course-list.module.css"
import {AdminCourseRow} from "@/entities/course/ui/AdminCourseRow";
import {Button} from "@/shared/ui/button/Button";
import {useCoursesQuery} from "@/entities/course";
import {Loader} from "@/shared/ui/loader";
import { useState} from "react";
import Link from "next/link";
import {CreateCourseForm} from "@/features/create-course/CreateCourseForm";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useCourseMutations} from "@/entities/course/model/useCourseMutations";



export const AdminCourseList = () => {

    const { data,isLoading } = useCoursesQuery()
    const courses = data?.data ?? []
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<{
        id: string
        name: string
    } | null>(null)

    const mutations = useCourseMutations();

    if (isLoading) return <Loader />

    return (
        <div className={`${styles.container} ${styles.animateIn}`}>
            <div className={styles.headerRow}>
                <div>
                    <h2 className={styles.title}>Мои курсы</h2>
                    <p className={styles.subtitle}>
                        Управление образовательными программами
                    </p>
                </div>

                <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsOpen(true)}
                >
                    Создать курс
                </Button>
                <CreateCourseForm  isOpen={isOpen} onClose={() => setIsOpen(false)}>

                </CreateCourseForm>
            </div>

            <div className={styles.gridList}>
                {courses.map((course) => (
                    <Link key={course.id ?? ""} href={`/admin/courses/${course.id}`}>
                        <AdminCourseRow
                            course={course}
                            onDelete={() => {
                                setSelectedCourse({
                                    id: course.id,
                                    name: course.name
                                })
                                setDeleteIsOpen(true)
                            }}
                        />
                    </Link>
                ))}
                <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteIsOpen(false)}
                    onConfirm={() => {
                    if (selectedCourse) {
                        mutations.remove(selectedCourse.id)
                        setDeleteIsOpen(false)
                    }
                }}
                itemName={selectedCourse?.name ?? ""}></ConfirmDeleteModal>
            </div>
        </div>
    )
}