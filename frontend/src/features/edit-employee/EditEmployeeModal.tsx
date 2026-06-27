import {Modal} from "@/shared/ui/modal/ui/Modal";
import {useState} from "react";
import {Button} from "@/shared/ui/button/Button";
import {EmployeeForm} from "@/features/employee-form/EmployeeForm";
import {UserRequest} from "@/entities/user/models/types";

export type Props = {
    onConfirm: (form : UserRequest) => void;
    isOpen : boolean
    onClose: () => void
}

type EditProps = Props & {
    id: string;
    initialData: UserRequest;
};

export function EditEmployeeModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      initialData,
                                  }: EditProps) {
    const [form, setForm] = useState<UserRequest>(initialData);

    return (
        <Modal
            title="Редактирование сотрудника"
            open={isOpen}
            onClose={onClose}
            width={600}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={() => onConfirm(form)}>
                        Сохранить
                    </Button>
                </div>
            }
        >
            <EmployeeForm value={form} onChange={setForm} />
        </Modal>
    );
}