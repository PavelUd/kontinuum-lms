import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {Plus} from "lucide-react";
import {GroupsList} from "@/widgets/groups-list/GroupsList";
import {GroupFilters} from "@/features/groups/filters/GroupFilters";
import {CreateGroupModal} from "@/features/groups/create-group/CreateGroupModal";
import {useState} from "react";
import { GroupRequest } from "@/entities/group/module/types";

export function GroupsPage() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <AdminSectionHeader title={"Группы"}
                                subtitle={"Управление учебными группами по курсам"}
                                actions={
                                    <Button
                                        variant="primary"
                                        icon={<Plus size={18}/>}
                                        fullWidth={true}
                                        onClick={() => setIsOpen(true)}
                                    >
                                        Создать группу
                                    </Button>
                                }>
            </AdminSectionHeader>
            <GroupFilters></GroupFilters>
            <GroupsList></GroupsList>
            <CreateGroupModal isOpen={isOpen} onClose={() => setIsOpen(false)}
                              onConfirm={() => setIsOpen(false)}></CreateGroupModal>
        </>
    )
}