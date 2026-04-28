import {GroupMember} from "@/entities/group-member/model/types";
import {GroupMemberStatsRow} from "@/entities/group-member/ui/GroupMemberStatsRow";

export function GroupMembersStatsList(){

    const members : GroupMember[] = [
        {
            id: "1",
            fullName: "groupMembers",
            userId: "1",
            groupId: "1"
        },
        {
            id: "2",
            fullName: "groupMembers",
            userId: "1",
            groupId: "1"
        },
        {
            id: "3",
            fullName: "groupMembers",
            userId: "1",
            groupId: "1"
        },
        {
            id: "4",
            fullName: "groupMembers",
            userId: "1",
            groupId: "1"
        }
    ]

    return (
        <div>
            {members.map(member => (
                <GroupMemberStatsRow key={member.id} member={member}>
                </GroupMemberStatsRow>
            ))}
        </div>
    )
}