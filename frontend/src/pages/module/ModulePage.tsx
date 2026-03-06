"use client"

import {CourseSummary} from "@/entities/course";
import {ModuleSummary} from "@/entities/module";
import { CurriculumSidebar } from "@/features/curriculum-sidebar/CurriculumSidebar";
import {Header} from "@/widgets/module-header/Header"
import {useState} from "react";
import {ModuleHero} from "@/widgets/module/ui/ModuleHero";
import {ModuleContent} from "@/widgets/module/ui/ModuleContent";
import styles from "@/widgets/module/ui/module.module.css"
type Props = {
        course: CourseSummary
        lesson: ModuleSummary
    }

export function ModulePage({ course, lesson }: Props) {
    const blocks = [
        {
            id: "1",
            type: "text",
            data: {
                content: "Сегодня мы разберем одну из самых важных тем в курсе математики 11 класса. <b>Производная</b> — это не просто формула, которую нужно выучить, это скорость изменения функции в конкретной точке."
            }
        }
    ]
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
        <Header onOpenSidebar={() => setSidebarOpen(true)}></Header>
        <CurriculumSidebar
            open={sidebarOpen}
            onOpenChange={() => setSidebarOpen(false)} modules={[]}            />
        <div className={styles.container}>
            <ModuleHero module={0} category={""} title={""} duration={0} totalSteps={6} currentStep={3} progress={3}></ModuleHero>
        </div>
        <div>
            <ModuleContent blocks={blocks}></ModuleContent>
        </div>
        </>
    )
}