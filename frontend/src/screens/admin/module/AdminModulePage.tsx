"use client"

import {AdminModuleHeader} from "@/widgets/module-header/AdminModuleHeader";
import {GroupsStatsList} from "@/widgets/groups-list/GroupsStatsList";
import {useModuleQuery} from "@/entities/module/model/useModulesQuery";
import {Loader} from "@/shared/ui/loader";

export type Props = {
    moduleId: string
}

export function AdminModulePage({moduleId}: Props) {

    const {data, isLoading} = useModuleQuery(moduleId);

    if (isLoading) return <Loader />

    return (
        <>
        <AdminModuleHeader module={data?.data}></AdminModuleHeader>
        <GroupsStatsList moduleId={moduleId} courseId={data?.data.courseId ?? ""}></GroupsStatsList>
        </>
    );
}