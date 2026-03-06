"use client"

import {CurriculumSidebar} from "@/features/curriculum-sidebar/CurriculumSidebar";
import {Header} from "@/widgets/module-header/Header"
import {useState} from "react";
import {ModuleHero} from "@/widgets/module/ui/ModuleHero";
import {ModuleContent} from "@/widgets/module/ui/ModuleContent";
import styles from "@/widgets/module/ui/module.module.css"
import {Loader} from "@/shared/ui/loader";
import {useModuleQuery} from "@/entities/module/model/useModulesQuery";
import {Course} from "@/entities/course/model/types";
import {useCourseQuery} from "@/entities/course";
type Props = {
        courseId: string
        lessonId: string
    }

export function ModulePage({ courseId, lessonId }: Props) {

    const {
        data: moduleData,
        isLoading: moduleLoading,
        isError: moduleError
    } = useModuleQuery(lessonId);

    const {
        isLoading: courseLoading,
        data: courseData,
    } = useCourseQuery(courseId);

    const [sidebarOpen, setSidebarOpen] = useState(false)

    if (moduleLoading && courseLoading) return <Loader />
    if (moduleError) return <div>Ошибка загрузки</div>


    const lesson = moduleData?.data;
    const lessons = courseData?.data.lessons ?? [];
    if (!lesson) {
        return null
    }

    return (
        <>
        <Header onOpenSidebar={() => setSidebarOpen(true)}></Header>
        <CurriculumSidebar
            open={sidebarOpen}
            onOpenChange={() => setSidebarOpen(false)} modules={lessons} courseId={courseData?.data.id ?? ""}  />
        <div className={styles.container}>
            <ModuleHero module={lesson.orderIndex} category={courseData?.data?.name ?? ""} title={lesson.title} duration={15} totalSteps={6} currentStep={3} progress={3}></ModuleHero>
        </div>
        <div>
            <ModuleContent blocks={lesson?.blocks}></ModuleContent>
        </div>
        </>
    )
}

export default ModulePage