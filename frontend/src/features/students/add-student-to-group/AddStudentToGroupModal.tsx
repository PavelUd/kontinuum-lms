import {Button} from "@/shared/ui/button/Button";
import {useEffect, useState} from "react";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {useCoursesLookupQuery} from "@/entities/course/model/useCoursesQuery";
import {Select} from "@/shared/ui/input/Select";
import {useAvailableGroupsLookup} from "@/entities/group/module/useGroupsQuery";
import { CreateGroupMemberRequest } from "@/entities/group-member/model/types";

export type Props = {
    onConfirm: (request : CreateGroupMemberRequest) => void;
    isOpen : boolean
    onClose: () => void
    studentName? : string,
    studentId? : string
}


export function AddStudentToGroupModal({ isOpen, onClose, onConfirm, studentName, studentId }: Props){

    const initialForm: CreateGroupMemberRequest = {
        groupId : "",
        userId : studentId
    }
    const {data: coursesData} = useCoursesLookupQuery();
    const [courseId, setCourseId] = useState('')
    const { data: groups } = useAvailableGroupsLookup(courseId, studentId);
    const [form, setForm] = useState<CreateGroupMemberRequest>(initialForm)

    useEffect(() => {
        if (isOpen) {
            console.log(studentId)
            setCourseId('');
        }
    }, [isOpen]);

    const handleChange = <K extends keyof CreateGroupMemberRequest>(key: K, value: CreateGroupMemberRequest[K]) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }


    const courseOptions = [
        { value: "", label: "Курс не выбран..." },
        ...(coursesData?.map(c => ({
            value: c.id,
            label: c.name
        })) ?? [])
    ];

    const groupOptions = [
        { value: "", label: "Группа не выбрана..." },
        ...(groups?.map(g => ({
            value: g.id,
            label: g.title
        })) ?? [])
    ];


    const handleSubmit = async () => {
        await onConfirm(form)
        setForm(initialForm)
    }
    return (
        <Modal
            title="Добавить в группу"
            open={isOpen}
            onClose={onClose}
            width={550}
            footer={
                <div className="p-4 py-2 border-t border-gray-100 flex gap-4">
                    <Button className="w-full" variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button className="w-full" variant="primary" onClick={handleSubmit}>
                        Добавить
                    </Button>
                </div>
            }
        >
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-500 mb-2">
                    Ученик
                </label>

                <div className="font-semibold text-gray-900">
                    {studentName}
                </div>
            </div>

            <div className="mb-4">
                <Select
                    label="Выберите курс"
                    options={courseOptions}
                    value={courseId}
                    onChange={(value) => setCourseId(value.target.value)}
                />
            </div>

            {courseId && (
                <div className="mb-4">
                    <Select
                        label="Выберите группу"
                        options={groupOptions}
                        value={form.groupId}
                        onChange={(value) => handleChange("groupId", value.target.value)}
                    />
                </div>
            )}
        </Modal>
    )
}