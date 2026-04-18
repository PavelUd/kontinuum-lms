import {GroupRequest} from "@/entities/group/module/types";
import {Button} from "@/shared/ui/button/Button";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Input} from "@/shared/ui/input/Input";
import {useEmployeesLookupQuery} from "@/entities/user/models/useEmployeesQuery";
import {useCoursesLookupQuery} from "@/entities/course/model/useCoursesQuery";
import {Select} from "@/shared/ui/input/Select";
import { useState } from "react";


export type Props = {
    onConfirm: (request : GroupRequest) => void;
    isOpen : boolean
    onClose: () => void
}

export function CreateGroupModal({ isOpen, onClose, onConfirm }: Props){

    const {data} = useEmployeesLookupQuery();
    const {data: coursesData} = useCoursesLookupQuery();

    const initialForm: GroupRequest = {
        title: "",
        courseId: "",
        teacherId: ""
    }

    const [form, setForm] = useState<GroupRequest>(initialForm)
    const [errors, setErrors] = useState<{ courseId?: string }>({})
    const handleChange = <K extends keyof GroupRequest>(key: K, value: GroupRequest[K]) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSubmit = async () => {
        const newErrors: typeof errors = {}

        if (!form.courseId) {
            newErrors.courseId = "Выберите курс"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        await onConfirm(form)
        setForm(initialForm)
        setErrors({})
    }


    return (
        <Modal
            title="Создание группы"
            open={isOpen}
            onClose={onClose}
            width={550}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Создать
                    </Button>
                </div>
            }
        >
        <div className="mb-5">
            <Input
                className={"mb-2"}
                label="Название группы"
                fullWidth={true}
                value={form.title}
                onChange={e => handleChange("title", e.target.value)}
            />
            <Select
                className="mb-5"
                label="Курс"
                fullWidth
                error={errors.courseId}
                value={form.courseId}
                onChange={(e) => handleChange("courseId", e.target.value)}
                options={[
                    { value: "", label: "Выберите курс" },
                    ...(coursesData?.map(item => ({
                        value: item.id,
                        label: item.name
                    })) ?? [])
                ]}
            />
            <Select
                className="mb-5"
                label="Преподаватель"
                fullWidth
                value={form.teacherId}
                onChange={e => handleChange("teacherId", e.target.value)}
                options={[
                    { value: "", label: "Без преподавателя" },
                    ...(data?.map(item => ({
                        value: item.id,
                        label: item.fullname
                    })) ?? [])
                ]}
            />
        </div>
        </Modal>
    )
}