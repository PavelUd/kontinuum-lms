"use client"

import {CurriculumSidebar} from "@/features/curriculum-sidebar/CurriculumSidebar";
import {Header} from "@/widgets/module-header/Header"
import {useState} from "react";
import {ModuleHero} from "@/widgets/module/ui/ModuleHero";
import {ModuleContent} from "@/widgets/module/ui/ModuleContent";
import styles from "@/widgets/module/ui/module.module.css"
import {Loader} from "@/shared/ui/loader";
import {useModulesQuery} from "@/entities/module/model/useModulesQuery";
import {useCourseQuery} from "@/entities/course";
import {useProfileQuery} from "@/entities/user/models/useUsersQuery";
import {useModuleBlocks} from "@/entities/module-block/model/useModuleBlocks";
import {Button} from "@/shared/ui/button/Button";
import Link from "next/link";

type Props = {
        courseId: string
        lessonId: string
    }

export function ModulePage({ courseId, lessonId }: Props) {

    const {
        data: modulesData,
        isLoading: modulesLoading,
        isError: modulesError
    } = useModulesQuery(courseId);

    const {
            data: profileData,
            isLoading: profileLoading,
            isError: profileError
        } = useProfileQuery();


    const {
        isLoading: courseLoading,
        data: courseData,
    } = useCourseQuery(courseId);

    const {
        isLoading: blocksLoading,
        data: blocks,
        isError: isBlocksErrors
    } = useModuleBlocks(lessonId)

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const profile = profileData?.data
    if (modulesLoading && courseLoading && profileLoading && blocksLoading) return <Loader />
    if (modulesError && profileError && isBlocksErrors) return <div>Ошибка загрузки</div>


    const lessons = modulesData?.data ?? [];
    const lesson = lessons?.find(m => m.id === lessonId)
    if (!lesson) {
        return null
    }

    const nextLesson = lessons.find(
        l => l.status === "active" && l.orderIndex > lesson.orderIndex
    ) ?? null

    return (
        <>
        <Header onOpenSidebar={() => setSidebarOpen(true)} profile={profile}></Header>
        <CurriculumSidebar
            open={sidebarOpen}
            currentModuleId={lesson.id}
            onOpenChange={() => setSidebarOpen(false)} modules={lessons} courseId={courseData?.data.id ?? ""}  />
        <div className={styles.container}>
            <ModuleHero module={lesson.orderIndex} category={courseData?.data?.name ?? ""} title={lesson.title} duration={15} totalSteps={6} currentStep={3} progress={3}></ModuleHero>
            <ModuleContent blocks={blocks}></ModuleContent>
            <footer className={styles.lessonFooter}>
                <div></div>
                {nextLesson && (
                    <Link href={`${nextLesson.id}`}>
                        <Button variant="primary">
                            Завершить урок
                        </Button>
                    </Link>
                )}
            </footer>
        </div>
        </>
    )
}

export default ModulePage