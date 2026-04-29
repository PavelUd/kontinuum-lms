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
            {data?.map(member => (
                <GroupMemberStatsRow groupName={groupName} key={member.id} member={member}>
                </GroupMemberStatsRow>
            ))}
        </div>
    )
}