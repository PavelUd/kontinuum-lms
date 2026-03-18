import {AdminCourseHeader} from "@/widgets/course-header/AdminCourseHeader";
import {AdminModulesList} from "@/widgets/modules-list/AdminModulesList";

type Props = {
    courseId: string
}


export function AdminCoursePage({courseId} : Props) {
    const course = {
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
            { id: 4, title: 'Введение в производную', progress: 95, avgTime: '12:30', avgScore: '4.8', available: true },
            { id: 5, title: 'Правила дифференцирования', progress: 82, avgTime: '18:45', avgScore: '4.2', available: true },


        ]
    }

    const modules = course.modules


    return (
        <>
        <AdminCourseHeader title={course.title} students={course.students} avgProgress={course.avgProgress} avgScore={course.avgScore} />
            <AdminModulesList modules={modules} />
        </>
    );
}