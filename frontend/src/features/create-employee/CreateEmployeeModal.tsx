import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";
import {useState} from "react";
import {EmployeeForm} from "@/features/employee-form/EmployeeForm";
import {UserRequest} from "@/entities/user/models/types";

export type Props = {
    onConfirm: (request : UserRequest) => void;
    isOpen : boolean
    onClose: () => void
}

export function CreateEmployeeModal({ isOpen, onClose, onConfirm }: Props) {
    const [form, setForm] = useState<UserRequest>({
        fullName: "",
        phone: "",
        email: "",
        role: "teacher",
    });

    return (
        <Modal
            title="Добавление сотрудника"
            open={isOpen}
            onClose={onClose}
            width={900}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={() => onConfirm(form)}>
                        Добавить
                    </Button>
                </div>
            }
        >
            <EmployeeForm value={form} onChange={setForm} />
        </Modal>
    );
}