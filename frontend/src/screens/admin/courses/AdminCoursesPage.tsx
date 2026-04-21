'use client'

import styles from "@/screens/admin/courses/admin-course-list.module.css";
import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {AdminCourseList} from "@/widgets/course-list/ui/AdminCourseList";
import {Plus} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import {useState} from "react";
import {CreateCourseForm} from "@/features/create-course/CreateCourseForm";

export function AdminCoursesPage() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
        <div className={`${styles.container} ${styles.animateIn}`}>
            <AdminSectionHeader title={"Курсы"} subtitle={"Управление образовательными программами"} actions={
                <Button
                variant="primary"
                icon={<Plus size={18} />}
                fullWidth={true}
                onClick={() => setIsOpen(true)}
            >
                Создать курс
            </Button>
            }>
            </AdminSectionHeader>
            <AdminCourseList></AdminCourseList>
        </div>
            <CreateCourseForm  isOpen={isOpen} onClose={() => setIsOpen(false)}>
            </CreateCourseForm>
        </>
    )
}