"use client"

import {useState} from "react";
import {CreateStudentRequest} from "@/entities/user/models/types";
import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {UserPlus} from "lucide-react";
import {StudentFilters} from "@/features/students/filters/StudentFilters";
import {StudentsList} from "@/widgets/students-list/StudentsList";
import {CreateStudentModal} from "@/features/students/create-student/CreateStudentModal";
import {useStudentMutations} from "@/entities/user/models/useStudentsMutations";

export function StudentsPage() {

    const [isOpen, setIsOpen] = useState(false);
    const mutations = useStudentMutations();

    const onConfirmCreation = (request: CreateStudentRequest) => {
        mutations.create(request)
        setIsOpen(false)
    }

    return (
        <>
            <AdminSectionHeader title={"Все ученики"}
                                subtitle={"Полный реестр учеников платформы"}
                                actions={
                                    <Button
                                        variant="primary"
                                        icon={<UserPlus size={18}/>}
                                        fullWidth={true}
                                        onClick={() => setIsOpen(true)}
                                    >
                                        Добавить ученика
                                    </Button>
                                }>
            </AdminSectionHeader>
            <StudentFilters></StudentFilters>
            <StudentsList></StudentsList>
            <CreateStudentModal onConfirm={onConfirmCreation} isOpen={isOpen} onClose={() => setIsOpen(false)}></CreateStudentModal>
        </>
    )
}