import {AdminModuleHeader} from "@/widgets/module-header/AdminModuleHeader";
import {GroupsStatsList} from "@/widgets/groups-list/GroupsStatsList";

export type Props = {
    moduleId: string
}

export function AdminModulePage({moduleId}: Props) {
    return (
        <>
        <AdminModuleHeader moduleId={moduleId}></AdminModuleHeader>
        <GroupsStatsList></GroupsStatsList>
        </>
    );
}