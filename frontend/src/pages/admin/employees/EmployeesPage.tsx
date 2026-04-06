'use client'

import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {UserPlus} from "lucide-react";
import {EmployeeList} from "@/widgets/employees-list/EmployeeList";
import {useState} from "react";
import {CreateEmployeeModal} from "@/features/create-employee/CreateEmployeeModal";

export function EmployeesPage(){

    const [isOpen, setIsOpen] = useState(false)

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
            <CreateEmployeeModal onConfirm={() => {}} isOpen={isOpen} onClose={() => setIsOpen(false)}></CreateEmployeeModal>
        </>
    )
}