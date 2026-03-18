'use client'

import {Plus} from "lucide-react";
import {useState} from "react";
import styles from "./admin-course-list.module.css"
import {AdminCourseRow} from "@/entities/course/ui/AdminCourseRow";
import {Button} from "@/shared/ui/button/Button";


export const AdminCourseList = () => {

    const [courses, setCourses] = useState([
        {
            id: 1,
            title: 'Математика ЕГЭ 2026',
            modulesCount: 32,
            students: 450,
            avgProgress: 68,
            avgScore: '4.4 / 5',
            status: 'active',
            modules: [
                { id: 1, title: 'Введение в производную', progress: 95, avgTime: '12:30', avgScore: '4.8', available: true },
                { id: 2, title: 'Правила дифференцирования', progress: 82, avgTime: '18:45', avgScore: '4.2', available: true },
                { id: 3, title: 'Сложные функции', progress: 45, avgTime: '24:10', avgScore: '3.6', available: true },
                { id: 4, title: 'Геометрический смысл', progress: 60, avgTime: '15:20', avgScore: '4.0', available: false },
            ]
        },
        {
            id: 2,
            title: 'Русский язык ОГЭ',
            modulesCount: 24,
            students: 280,
            avgProgress: 42,
            avgScore: '4.1 / 5',
            status: 'active',
            modules: []
        }
    ]);


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
                    <AdminCourseRow key={course.id} course={course}></AdminCourseRow>
                ))}
            </div>
        </div>
    )
}