import {AdminSectionHeader} from "@/widgets/admin-section-header/adminSectionHeader";
import {Button} from "@/shared/ui/button/Button";
import {Plus} from "lucide-react";
import {GroupsList} from "@/widgets/groups-list/GroupsList";
import {GroupFilters} from "@/features/groups/filters/GroupFilters";
import {CreateGroupModal} from "@/features/groups/create-group/CreateGroupModal";
import {useState} from "react";

export function GroupsPage() {

    const [isOpen, setIsOpen] = useState(false)

    const [courseId, setCourseId] = useState<string>("")
    const [teacherId, setTeacherId] = useState<string>("")

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
            <GroupFilters
                courseId={courseId}
                teacherId={teacherId}
                onCourseChange={setCourseId}
                onTeacherChange={setTeacherId}
                onReset={() => {
                    setCourseId("")
                    setTeacherId("")
                }}
            />
            <GroupsList courseId={courseId} teacherId={teacherId}></GroupsList>
            <CreateGroupModal isOpen={isOpen} onClose={() => setIsOpen(false)}
                              onConfirm={() => setIsOpen(false)}></CreateGroupModal>
        </>
    )
}