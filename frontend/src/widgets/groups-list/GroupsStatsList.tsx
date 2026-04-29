"use client"


import styles from "./group-stats-list.module.css"
import {GroupStatsRow} from "@/entities/group/ui/GroupStatsRow";
import {useState} from "react";
import {GroupMembersStatsList} from "@/widgets/group-members-list/GroupMembersStatsList";
import {UseGroupsProgressAnalyticQuery} from "@/entities/analytic/model/UseGroupProgressAnalyticQuery";
import {Loader} from "@/shared/ui/loader";


type Props = {
    courseId : string,
    moduleId: string
}

export function GroupsStatsList({courseId, moduleId} : Props){

    const [openedGroupId, setOpenedGroupId] = useState<string | null>(null)

    const pageSize = 4;

    const ROW_HEIGHT = 60 ;
    const GAP = 12;
    const minHeight = ROW_HEIGHT * pageSize  + GAP * (pageSize  - 1);

    const {data, isLoading} = UseGroupsProgressAnalyticQuery(courseId, moduleId);

    if (isLoading) {
        return (
            <div className="mb-5 p-1 overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-[300px] flex items-center justify-center animate-pulse text-slate-300">
                    Загрузка...
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="mb-5 p-1 overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-slate-500 text-base font-medium mb-1">
                        Нет групп
                    </div>
                    <div className="text-slate-400 text-sm">
                        Для этого курса еще не создано групп
                    </div>
                </div>
            </div>
        );
    }

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
                    {
                        data?.map(group => (
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
                                    <GroupMembersStatsList groupName={group.title} groupId={group.id} moduleId={moduleId} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}