"use client"


import styles from "./group-stats-list.module.css"
import {GroupStatsRow} from "@/entities/group/ui/GroupStatsRow";
import {Group} from "@/entities/group/module/types";
import {useState} from "react";
import {GroupMembersStatsList} from "@/widgets/group-members-list/GroupMembersStatsList";

export function GroupsStatsList(){

    const [openedGroupId, setOpenedGroupId] = useState<string | null>(null)

    const pageSize = 4;

    const ROW_HEIGHT = 60 ;
    const GAP = 12;
    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    const groups : Group[] = [
        {
            studentsCount: "1",
            id: "1",
            title: "ЕГЭ Профиль - Поток А",
            courseName: "name",
            courseId: "1"
        },
        {
            studentsCount: "1",
            id: "2",
            title: "ЕГЭ Профиль - Поток А",
            courseName: "name",
            courseId: "1"
        },
        {
            studentsCount: "1",
            id: "3",
            title: "ЕГЭ Профиль - Поток А",
            courseName: "name",
            courseId: "1"
        },
        {
            studentsCount: "1",
            id: "4",
            title: "ЕГЭ Профиль - Поток А",
            courseName: "name",
            courseId: "1"
        },
    ]

    return (
        <div className="mb-5 p-1 overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
            <div className={styles.table}>
                {/* HEADER */}
                <div className={styles.header}>
                    <div>Группа / Ученик</div>
                    <div>Прогресс</div>
                    <div></div>
                    <div></div>
                    <div className={styles.cellRight}>Действия</div>
                </div>

                <div className={styles.body} style={{
                    gridAutoRows: `${ROW_HEIGHT}px`,
                    minHeight: `${minHeight}px`
                }}>
                    {groups.map(group => (
                        <div key={group.id}>
                            <GroupStatsRow
                                group={group}
                                isOpen={openedGroupId === group.id}
                                onToggle={() =>
                                    setOpenedGroupId(prev =>
                                        prev === group.id ? null : group.id
                                    )
                                }
                            />
                            {openedGroupId === group.id && (
                                <div className="col-span-full">
                                    <GroupMembersStatsList />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}