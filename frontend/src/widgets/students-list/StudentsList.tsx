import styles from "./students-list.module.css"
import {StudentRow} from "@/entities/user/ui/students/StudentRow";
import {useStudentsQuery} from "@/entities/user/models/useStudentsQuery";
import {useEffect, useState} from "react";
import {useSafePagination} from "@/shared/ui/pagination/useSafePagination";
import {Loader} from "@/shared/ui/loader";
import {Pagination} from "@/shared/ui/pagination/Pagination";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useStudentMutations} from "@/entities/user/models/useStudentsMutations";
import {EmptyList} from "@/widgets/empty-list/EmptyList";
import {AddStudentToGroupModal} from "@/features/students/add-student-to-group/AddStudentToGroupModal";
import {useGroupMembersMutations} from "@/entities/group/module/useGroupMembersMutations";
import {CreateStudentRequest} from "@/entities/user/models/types";
import {CreateGroupMemberRequest} from "@/entities/group/module/types";

export type Props = {
    studentSearch: string;
    filterGrade: string;
    filterStatus: string
}

export function StudentsList({studentSearch, filterGrade, filterStatus} : Props){

    const pageSize = 2;

    const ROW_HEIGHT = 75;
    const GAP = 12;
    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    const [page, setPage] = useState(1);
    const groupMembersMutations = useGroupMembersMutations();
    const { isLoading, data } = useStudentsQuery(page, pageSize, studentSearch, filterGrade, filterStatus)
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [isAddMembersModalOpen, setAddMembersModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{
        id: string
        name: string
    } | null>(null)


    useEffect(() => {
        setPage(1)
    }, [studentSearch, filterGrade, filterStatus])

    const onConfirmAddingToGroup = (request:  CreateGroupMemberRequest) => {

        request.userId = selectedStudent?.id
        console.log(request);
        groupMembersMutations.create(request)
        setAddMembersModalOpen(false)
    }

    const { stableTotalPages, markDeleting } = useSafePagination({
        data,
        isLoading,
        page,
        setPage
    })


    const mutations = useStudentMutations();

    if (isLoading) return <Loader />

    if(!data?.totalPages){
        return <EmptyList></EmptyList>
    }

    return (
        <>
            <div className={styles.studentTable}>

                {/* HEADER */}
                <div className={styles.header}>
                    <div>Ученик</div>
                    <div>Класс</div>
                    <div>Телефон</div>
                    <div>Курсов</div>
                    <div>Группы</div>
                    <div>Статус</div>
                    <div className={styles.cellRight}>Действия</div>
                </div>

                {/* BODY */}
                <div className={styles.body} style={{
                    gridAutoRows: `${ROW_HEIGHT}px`,
                    minHeight: `${minHeight}px`
                }}>
                    {data?.items.map(student => (
                        <StudentRow key={student.id} user={student}
                         onDelete={() => {
                            setSelectedStudent({
                                id: student?.id,
                                name: student.fullName
                            })
                            setDeleteIsOpen(true)
                        }}
                        onGroupAdd={() => {
                            setSelectedStudent({
                                id: student?.id,
                                name: student.fullName
                            })
                            setAddMembersModalOpen(true)
                        }}
                        ></StudentRow>
                    ))}
                </div>

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
                                    if (selectedStudent) {
                                        setDeleteIsOpen(false)
                                        mutations.remove(selectedStudent.id)
                                        markDeleting()
                                    }}}
                                itemName={selectedStudent?.name ?? ""}></ConfirmDeleteModal>
            <AddStudentToGroupModal isOpen={isAddMembersModalOpen}
                                    studentId={selectedStudent?.id}
                                    studentName={selectedStudent?.name}
                                    onClose={() => setAddMembersModalOpen(false)}
                                    onConfirm={onConfirmAddingToGroup}></AddStudentToGroupModal>
        </>
    )
}