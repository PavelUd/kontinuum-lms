'use client'

import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {UserPlus} from "lucide-react";
import {EmployeeList} from "@/widgets/employees-list/EmployeeList";
import {useState} from "react";
import {CreateEmployeeModal} from "@/features/create-employee/CreateEmployeeModal";
import {useEmployeeMutations} from "@/entities/user/models/useEmployeesMutations";
import {UserRequest} from "@/entities/user/models/types";

export function EmployeesPage(){

    const [isOpen, setIsOpen] = useState(false)

    const mutations = useEmployeeMutations(1, 2);

    const onConfirmCreation = async (request :  UserRequest) => {
        const response = await mutations.create(request)
        return {
            inviteLink: response.data?.link
        }
    }

    return (
        <>
        <AdminSectionHeader title={"Сотрудники"}
                            subtitle={"Управление командой платформы"}
                            actions={
                                <Button
                                    variant="primary"
                                    icon={<UserPlus size={18} />}
                                    fullWidth={true}
                                    onClick={() => setIsOpen(true)}
                                >
                                    Добавить сотрудника
                                </Button>
                            }>
        </AdminSectionHeader>
        <EmployeeList>
        </EmployeeList>
            <CreateEmployeeModal onConfirm={onConfirmCreation} isOpen={isOpen} onClose={() => setIsOpen(false)}></CreateEmployeeModal>
        </>
    )
}