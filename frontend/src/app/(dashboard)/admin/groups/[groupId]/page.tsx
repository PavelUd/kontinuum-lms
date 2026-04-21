import {GroupPage} from "@/screens/admin/group/GroupPage";

type Props = {
    params: Promise<{
        groupId: string
    }>
}

export default async function Page({ params }: Props) {

    const {groupId} = await params;

    return (
        <GroupPage groupId={groupId}></GroupPage>
    )
}