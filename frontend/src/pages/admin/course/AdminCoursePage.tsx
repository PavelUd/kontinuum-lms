'use client'

import {AdminCourseHeader} from "@/widgets/course-header/AdminCourseHeader";
import {AdminModulesList} from "@/widgets/modules-list/AdminModulesList";
import {useCourseQuery} from "@/entities/course";
import {Loader} from "@/shared/ui/loader";

type Props = {
    courseId: string
}


export function AdminCoursePage({courseId} : Props) {

    const { data: source, isLoading: isLoading } = useCourseQuery(courseId)

    if (isLoading) return <Loader />

    const course= source?.data;

    const modules = course?.lessons ?? []


    return (
        <>
        <AdminCourseHeader title={course?.name ?? ""} students={12} avgProgress={13} avgScore={"4.8"} />
            <AdminModulesList modules={modules} />
        </>
    );
}