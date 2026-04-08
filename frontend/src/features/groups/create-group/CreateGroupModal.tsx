import {GroupRequest} from "@/entities/group/module/types";
import {Button} from "@/shared/ui/button/Button";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Input} from "@/shared/ui/input/Input";


export type Props = {
    onConfirm: (request : GroupRequest) => void;
    isOpen : boolean
    onClose: () => void
}

export function CreateGroupModal({ isOpen, onClose, onConfirm }: Props){
    return (
        <Modal
            title="Создание группы"
            open={isOpen}
            onClose={onClose}
            width={900}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={() => {}}>
                        Создать
                    </Button>
                </div>
            }
        >
        <div className="mb-5">
            <Input
                className={"mb-5"}
                label="Название группы"
                fullWidth={true}
                value={"hello"}
                onChange={e => {}}
            />
            <Input
                className={"mb-5"}
                label="Курс"
                fullWidth={true}
                value={"hello"}
                onChange={e => {}}
            />
            <Input
                label="Преподаватель"
                fullWidth={true}
                value={"hello"}
                onChange={e => {}}
            />
        </div>
        </Modal>
    )
}