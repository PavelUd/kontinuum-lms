'use client'

import styles from "./employees-list.module.css";
import {EmployeeRow} from "@/entities/user/ui/employee/EmployeeRow";
import {User, UserRequest} from "@/entities/user/models/types";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useState} from "react";
import {EditEmployeeModal} from "@/features/edit-employee/EditEmployeeModal";

export function EmployeeList() {
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [isEditOpen, setEditIsOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<{
        id: string
        name: string
    } | null>(null)
    const employees: User[] = [
        {
            id: "1",
            fullName: "Employee 1",
            phone: "+37100000001",
            email: "employee1@test.com",
            role: "teacher",
        },
        {
            id: "2",
            fullName: "Employee 2",
            phone: "+37100000002",
            email: "employee2@test.com",
            role: "admin",
        },
    ]

    return (
        <>
            <div className={styles.gridList}>
                {employees.map((employee) => {
                    return (
                        <EmployeeRow user={employee} key={employee.id} onDelete={() => {
                            setSelectedEmployee({
                                id: employee.id,
                                name: employee.fullName
                            })
                            setDeleteIsOpen(true)
                        }}
                        onEdit={() => setEditIsOpen(true)}
                        ></EmployeeRow>
                    )
                })
                }
            </div>
            <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteIsOpen(false)} onConfirm={() => {
            }} itemName={selectedEmployee?.name ?? ""}></ConfirmDeleteModal>
            <EditEmployeeModal onConfirm={(from) =>{}} isOpen={isEditOpen} onClose={() =>setEditIsOpen(false)} id={""} initialData={{
                fullName: "",
                phone: "",
                email: "",
                role: "teacher"
            }}></EditEmployeeModal>
        </>
    )
}