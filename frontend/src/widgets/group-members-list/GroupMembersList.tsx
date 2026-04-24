"use client"

import {GroupMemberRow} from "@/entities/group-member/ui/GroupMemberRow";
import {useState} from "react";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";
import {useGroupMembersQuery} from "@/entities/group-member/model/useGroupMembersQuery";
import {useGroupMembersMutations} from "@/entities/group-member/model/useGroupMembersMutations";
import {Loader} from "@/shared/ui/loader";
import {useSafePagination} from "@/shared/ui/pagination/useSafePagination";
import {Pagination} from "@/shared/ui/pagination/Pagination";

type Props = {
    groupId : string
}

export function GroupMembersList({groupId} : Props) {

    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<{
        id: string
        name: string
    } | null>(null)

    const ROW_HEIGHT = 85;
    const GAP = 5;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    const { isLoading, data } = useGroupMembersQuery(page, pageSize, groupId);
    const mutations = useGroupMembersMutations();

    const { stableTotalPages, markDeleting } = useSafePagination({
        data,
        isLoading,
        page,
        setPage
    })

    const members = data;

    if (isLoading) return <Loader />

return (
    <>
        <div className="font-bold text-2xl mb-3">
            Состав группы
        </div>

    <div className="p-3 bg-gray-100 rounded-xl border border-gray-200" style={{
        gridAutoRows: `${ROW_HEIGHT}px`,
        minHeight: `${minHeight}px`
    }}>
        {members?.items?.map((member, idx) => {
            return (<GroupMemberRow key={idx} member={member} onDelete={() => {
                setSelectedMember({
                    id: member.id,
                    name: member.fullName
                })
                setDeleteIsOpen(true);
            }}>
            </GroupMemberRow>)
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
                                if (selectedMember) {
                                    mutations.remove(selectedMember.id)
                                    setDeleteIsOpen(false)
                                    markDeleting()
                                }}}
                            itemName={selectedMember?.name ?? ""}
    ></ConfirmDeleteModal>
    </>
)
}