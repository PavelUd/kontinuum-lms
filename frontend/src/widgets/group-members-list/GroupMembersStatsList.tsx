"use client"

import {GroupMemberStatsRow} from "@/entities/group-member/ui/GroupMemberStatsRow";
import {
    UseGroupProgressAnalyticQuery,
} from "@/entities/analytic/model/UseGroupProgressAnalyticQuery";
import {Loader} from "@/shared/ui/loader";

type Props = {
    groupId: string,
    moduleId: string,
    groupName : string
}

export function GroupMembersStatsList({groupId, moduleId, groupName}: Props) {

    const {data, isLoading} = UseGroupProgressAnalyticQuery(groupId, moduleId);

    if (isLoading) return <Loader />

    return (
        <div>
            {data && data.length > 0 ? (
                data.map(member => (
                    <GroupMemberStatsRow
                        groupName={groupName}
                        key={member.id}
                        member={member}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    В группе нет участников
                </div>
            )}
        </div>
    )
}