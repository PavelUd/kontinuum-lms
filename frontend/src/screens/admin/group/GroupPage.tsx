import {AdminGroupHeader} from "@/widgets/group-header/AdminGroupHeader";
import {EditGroupForm} from "@/features/groups/edit-group/EditGroupForm";
import {GroupMembersList} from "@/widgets/group-members-list/GroupMembersList";

export type Props = {
    groupId: string
}

export function GroupPage({groupId} : Props) {
    return (
        <>
        <AdminGroupHeader></AdminGroupHeader>
        <EditGroupForm groupId={groupId}></EditGroupForm>
        <GroupMembersList groupId={groupId}></GroupMembersList>
        </>
    )
}
