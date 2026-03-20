'use client'

import {Plus} from "lucide-react";
import styles from "./admin-course-list.module.css"
import {AdminCourseRow} from "@/entities/course/ui/AdminCourseRow";
import {Button} from "@/shared/ui/button/Button";
import {useCoursesQuery} from "@/entities/course";
import {useCourseStore} from "@/entities/course/model/course.store";
import {Loader} from "@/shared/ui/loader";
import {useEffect} from "react";
import Link from "next/link";



export const AdminCourseList = () => {

    const courses = useCourseStore(s => s.courses)
    const { data,isLoading, isSuccess } = useCoursesQuery()
    const setCourses = useCourseStore(s => s.setCourses)

    useEffect(() => {
        if (!isSuccess) return
        setCourses(data.data)
    }, [isSuccess])

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
                    icon={<Plus size={18} />}>
                    Создать курс
                </Button>
            </div>

            <div className={styles.gridList}>
                {courses.map((course) => (
                    <Link key={course.id} href={`/admin/courses/${course.id}`}>
                        <AdminCourseRow course={course} />
                    </Link>
                ))}
            </div>
        </div>
    )
}