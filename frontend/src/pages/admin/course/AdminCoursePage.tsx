'use client'

import {AdminCourseHeader} from "@/widgets/course-header/AdminCourseHeader";
import {AdminModulesList} from "@/widgets/modules-list/AdminModulesList";
import {Loader} from "@/shared/ui/loader";
import {CreateModuleModal} from "@/features/create-module/CreateModuleModal";
import {useState} from "react";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useModulesQuery} from "@/entities/module/model/useModulesQuery";
import {useModulesMutations} from "@/entities/module/model/useModulesMutations";
import {useCourseQuery} from "@/entities/course";

type Props = {
    courseId: string
}


export function AdminCoursePage({courseId} : Props) {

    const { data: query, isLoading: isLoading } = useCourseQuery(courseId)
    const mutations = useModulesMutations()

    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [selectedModule, setSelectedModule] = useState<{
        id: string
        name: string
    } | null>(null)

    const { data: lessonQuery, isLoading: lessonLoading } = useModulesQuery(courseId)
    if(!query || isLoading){
        return
    }

    const lessons = lessonQuery?.data ?? []

    const onConfirmCreation = (title : string, orderIndex : number) => {
        mutations.create({courseId : courseId, title, orderIndex})
        setIsOpen(false)
    }

    const onClickDeleteButton = (id: string, name: string) => {
        setSelectedModule({id, name});
        lessons.filter(m => m.id !== id)
        setDeleteIsOpen(true)
    }

    const onDeleteModule = () => {

        mutations.remove(selectedModule?.id ?? "")
        setDeleteIsOpen(false)
    }

    if (isLoading) return <Loader />

    const course= query?.data;


    return (
        <>
        <AdminCourseHeader onCreate={() => setIsOpen(true)} title={course?.name ?? ""} students={12} avgProgress={13} avgScore={"4.8"} />
            <AdminModulesList onDelete={onClickDeleteButton} modules={lessons} courseId={courseId} />
            <CreateModuleModal onConfirm={onConfirmCreation} modulesCount={lessons.length} isOpen={isOpen} onClose={() => setIsOpen(false)}></CreateModuleModal>
            <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteIsOpen(false)} onConfirm={onDeleteModule} itemName={selectedModule?.name ?? ""}></ConfirmDeleteModal>
        </>
    );
}