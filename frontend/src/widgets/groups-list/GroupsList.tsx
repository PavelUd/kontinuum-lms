import styles from "@/widgets/employees-list/employees-list.module.css";
import {GroupRow} from "@/entities/group/ui/GroupRow";
import {useEffect, useState} from "react";
import {useGroupsQuery} from "@/entities/group/module/useGroupsQuery";
import {useSafePagination} from "@/shared/ui/pagination/useSafePagination";
import {Loader} from "@/shared/ui/loader";
import {Pagination} from "@/shared/ui/pagination/Pagination";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {EmptyGroupList} from "@/widgets/groups-list/EmptyGroupList";
import {useGroupMutations} from "@/entities/group/module/useGroupsMutations";

type Props = {
    courseId : string,
    teacherId : string,
}

export function GroupsList({courseId, teacherId} : Props) {

    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<{
        id: string
        name: string
    } | null>(null)

    const ROW_HEIGHT = 100;
    const GAP = 12;
    const pageSize = 2;

    useEffect(() => {
        setPage(1)
    }, [courseId, teacherId])

    const mutations = useGroupMutations();
    const [page, setPage] = useState(1);

    const { isLoading, data } = useGroupsQuery(page, pageSize, courseId, teacherId);

    const { stableTotalPages, markDeleting } = useSafePagination({
        data,
        isLoading,
        page,
        setPage
    })

    if (isLoading) return <Loader />

    const groups = data;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    if(!data?.totalPages){
        return <EmptyGroupList></EmptyGroupList>
    }

    return (
        <>
            <div className={styles.gridList} style={{
                gridAutoRows: `${ROW_HEIGHT}px`,
                minHeight: `${minHeight}px`
            }}>
                {groups?.items.map((group) => {
                    return (
                        <GroupRow key={group.id} group={group} onDelete={() => {
                            setSelectedGroup({
                                id: group.id,
                                name: group.title
                            })
                            setDeleteIsOpen(true)
                        }}></GroupRow>
                    )
                })}
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
                                    if (selectedGroup) {
                                        mutations.remove(selectedGroup.id)
                                        setDeleteIsOpen(false)
                                        markDeleting()
                                    }}}
                                itemName={selectedGroup?.name ?? ""}></ConfirmDeleteModal>
        </>
    )
}