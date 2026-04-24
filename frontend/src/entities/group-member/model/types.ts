export type CreateGroupMemberRequest = {
    userId? : string,
    groupId : string,
}

export type GroupMember = {
    id: string,
    fullName: string
    userId : string,
    groupId : string,
}