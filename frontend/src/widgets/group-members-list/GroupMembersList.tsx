"use client"

import { GroupMember } from "@/entities/group-member/model/types";
import {GroupMemberRow} from "@/entities/group-member/ui/GroupMemberRow";
import {useState} from "react";
import {ConfirmDeleteModal} from "@/features/confirm-delete/ConfirmDeleteModal";

export function GroupMembersList(){

    const pageSize = 4;
    const [page, setPage] = useState(1);
    const [isDeleteOpen, setDeleteIsOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<{
        id: string
        name: string
    } | null>(null)

    const ROW_HEIGHT = 85;
    const GAP = 5;

    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    const members : GroupMember[] = [
        {
            fullName : "name",
            userId : "1",
            groupId : "1",
            id: "1",
        },
        {
            fullName : "name",
            userId : "1",
            groupId : "1",
            id: "1",
        },
        {
            fullName : "name",
            userId : "1",
            groupId : "1",
            id: "1",
        },
        {
            fullName : "name",
            userId : "1",
            groupId : "1",
            id: "1",
        },
    ];

return (
    <>
        <div className="font-bold text-2xl mb-3">
            Состав группы
        </div>

    <div className="p-3 bg-gray-100 rounded-xl border border-gray-200" style={{
        gridAutoRows: `${ROW_HEIGHT}px`,
        minHeight: `${minHeight}px`
    }}>
        {members.map((member, idx) => {
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
    <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteIsOpen(false)}
                            onConfirm={() => {
                                if (selectedMember) {
                                    setDeleteIsOpen(false)
                                }}}
                            itemName={selectedMember?.name ?? ""}
    ></ConfirmDeleteModal>
    </>
)
}