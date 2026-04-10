import {CreateStudentRequest} from "@/entities/user/models/types";
import {useState} from "react";

import {Input} from "@/shared/ui/input/Input";
import {Select} from "@/shared/ui/input/Select";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";

export type Props = {
    onConfirm: (request : CreateStudentRequest) => void;
    isOpen : boolean
    onClose: () => void
}

export function CreateStudentModal({ isOpen, onClose, onConfirm }: Props){
    const initialForm: CreateStudentRequest = {
        fullName : "",
        email: "",
        phone: "",
        class: 9
    }

    const [form, setForm] = useState<CreateStudentRequest>(initialForm)
    const [errors, setErrors] = useState<{ courseId?: string }>({})
    const handleChange = <K extends keyof CreateStudentRequest>(key: K, value: CreateStudentRequest[K]) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSubmit = async () => {
        const newErrors: typeof errors = {}

        if (!form.phone) {
            newErrors.courseId = "Номер обязателен"
        }
        if (!form.fullName) {
            newErrors.courseId = "ФИО обязателен"
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
            title="Добавить ученика"
            open={isOpen}
            onClose={onClose}
            width={700}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        <Input
                            type="text"
                            label="ФИО"
                            placeholder="Иван Иванов"
                            value={form.fullName}
                            onChange={e => handleChange("fullName", e.target.value)}
                        />

                        <Select
                            className={"w-full"}
                            options={[
                                { value: 9, label: "9 класс" },
                                { value: 10, label: "10 класс" },
                                { value: 11, label: "11 класс" },
                            ]}
                            value={form.class}
                            label="Класс"
                            onChange={e => handleChange("class", Number(e.target.value))}
                        />

                <Input
                    className={"mb-2"}
                    label="Телефон"
                    value={form.phone}
                    onChange={e => handleChange("phone", e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                />

                <Input
                    label="Почта"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange("email", e.target.value)}
                    placeholder="example@gmail.com"
                />
            </div>
        </Modal>
    )
}