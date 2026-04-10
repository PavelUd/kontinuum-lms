import {Button} from "@/shared/ui/button/Button";
import {CreateStudentRequest} from "@/entities/user/models/types";
import {useState} from "react";
import {Modal} from "@/shared/ui/modal/ui/Modal";

export type Props = {
    onConfirm: (request : CreateStudentRequest) => void;
    isOpen : boolean
    onClose: () => void
}


export function AddStudentToGroupModal({ isOpen, onClose, onConfirm }: Props){

    const initialForm: CreateStudentRequest = {
        fullName : "",
        email: "",
        phone: "",
        class: 9
    }

    const [form, setForm] = useState<CreateStudentRequest>(initialForm)
    const handleChange = <K extends keyof CreateStudentRequest>(key: K, value: CreateStudentRequest[K]) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSubmit = async () => {
        await onConfirm(form)
        setForm(initialForm)
    }
    return (
        <Modal
            title="Добавить в группу"
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
            <div>

            </div>
        </Modal>
    )
}