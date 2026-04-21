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

    const [studentSearch, setStudentSearch] = useState('')
    const [filterGrade, setFilterGrade] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const onConfirmCreation = async (request: CreateStudentRequest) => {
        const response = await mutations.create(request)
        return {
            inviteLink: response.data?.link
        }
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
            <StudentFilters studentSearch={studentSearch} setStudentSearch={setStudentSearch} filterGrade={filterGrade} setFilterGrade={setFilterGrade} filterStatus={filterStatus} setFilterStatus={setFilterStatus}></StudentFilters>
            <StudentsList studentSearch={studentSearch} filterGrade={filterGrade} filterStatus={filterStatus}></StudentsList>
            <CreateStudentModal onConfirm={onConfirmCreation} isOpen={isOpen} onClose={() => setIsOpen(false)}></CreateStudentModal>
        </>
    )
}