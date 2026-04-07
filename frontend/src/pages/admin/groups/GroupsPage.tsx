import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {Plus} from "lucide-react";
import {GroupsList} from "@/widgets/groups-list/GroupsList";
import {GroupFilters} from "@/features/groups/filters/GroupFilters";

export function GroupsPage(){
    return (
        <>
            <AdminSectionHeader title={"Группы"}
                                subtitle={"Управление учебными группами по курсам"}
                                actions={
                                    <Button
                                        variant="primary"
                                        icon={<Plus size={18} />}
                                        fullWidth={true}
                                        onClick={() => {}}
                                    >
                                        Создать группу
                                    </Button>
                                }>
            </AdminSectionHeader>
            <GroupFilters></GroupFilters>
            <GroupsList></GroupsList>
        </>
    )
}