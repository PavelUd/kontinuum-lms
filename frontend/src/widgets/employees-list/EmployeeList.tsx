'use client'

import styles from "./employees-list.module.css";
import {EmployeeRow} from "@/entities/user/ui/employee/EmployeeRow";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useState} from "react";
import {EditEmployeeModal} from "@/features/edit-employee/EditEmployeeModal";
import {useEmployeesQuery} from "@/entities/user/models/useEmployeesQuery";
import {Loader} from "@/shared/ui/loader";
import {Pagination} from "@/shared/ui/pagination/Pagination";
import {useEmployeeMutations} from "@/entities/user/models/useEmployeesMutations";
import {useSafePagination} from "@/shared/ui/pagination/useSafePagination";

export function EmployeeList() {
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [isEditOpen, setEditIsOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<{
        id: string
        name: string
    } | null>(null)

    const pageSize = 2;
    const [page, setPage] = useState(1);


    const mutations = useEmployeeMutations(page, pageSize);
    const { isLoading, data } = useEmployeesQuery(page, pageSize);

    const { stableTotalPages, markDeleting } = useSafePagination({
        data,
        isLoading,
        page,
        setPage
    })

    if (isLoading) return <Loader />

    const employees = data;

    const ROW_HEIGHT = 100;
    const GAP = 12;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    return (
        <>
            <div className={styles.gridList} style={{
                gridAutoRows: `${ROW_HEIGHT}px`,
                minHeight: `${minHeight}px`
            }}>
                {employees?.items?.map((employee) => {
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
            {stableTotalPages && stableTotalPages  > 1 && (
                <Pagination
                    page={page}
                    totalPages={stableTotalPages}
                    onChange={setPage}
                />
            )}
            <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteIsOpen(false)}
                                onConfirm={() => {
                                    if (selectedEmployee) {
                                        mutations.remove(selectedEmployee.id)
                                        setDeleteIsOpen(false)
                                        markDeleting()
                                    }}}
                                itemName={selectedEmployee?.name ?? ""}></ConfirmDeleteModal>
            <EditEmployeeModal onConfirm={(from) =>{}} isOpen={isEditOpen} onClose={() =>setEditIsOpen(false)} id={""} initialData={{
                fullName: "",
                phone: "",
                email: "",
                role: "teacher"
            }}></EditEmployeeModal>
        </>
    )
}