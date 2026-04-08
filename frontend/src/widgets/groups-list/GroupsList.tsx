import styles from "@/widgets/employees-list/employees-list.module.css";
import {GroupRow} from "@/entities/group/ui/GroupRow";
import {useState} from "react";
import {useGroupsQuery} from "@/entities/group/module/useGroupsQuery";
import {useSafePagination} from "@/shared/ui/pagination/useSafePagination";
import {Loader} from "@/shared/ui/loader";
import {Pagination} from "@/shared/ui/pagination/Pagination";

export function GroupsList() {


    const ROW_HEIGHT = 100;
    const GAP = 12;

    const pageSize = 2;
    const [page, setPage] = useState(1);
    const { isLoading, data } = useGroupsQuery(page, pageSize, "", "");

    const { stableTotalPages, markDeleting } = useSafePagination({
        data,
        isLoading,
        page,
        setPage
    })

    if (isLoading) return <Loader />

    const groups = data;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    return (
        <>
            <div className={styles.gridList} style={{
                gridAutoRows: `${ROW_HEIGHT}px`,
                minHeight: `${minHeight}px`
            }}>
                {groups?.items.map((group) => {
                    return (
                        <GroupRow key={group.id} group={group} onDelete={() => {}} onEdit={() => {}}></GroupRow>
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
        </>
    )
}