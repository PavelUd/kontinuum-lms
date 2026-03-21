
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";
import {Trash2} from "lucide-react";

export type Props = {
    isOpen : boolean
    onClose: () => void,
    onConfirm: () => void,
    itemName: string
}

export function ConfirmDeleteModal({ isOpen, onClose,onConfirm, itemName }: Props){

    return (
        <Modal title={<div>Подтверждение удаления</div>}
               open={isOpen}
               onClose={onClose}
               footer={
                   <div className="flex gap-3 mt-4 px-0 !pb-0">
                       <Button variant={"danger"} className={"w-full"} onClick={onClose}>Отмена</Button>
                       <Button variant={"outline"} className={"w-full"} onClick={onConfirm}>Удалить</Button>
                   </div>
               }
                >
            <div className="text-center py-3">
                <div
                    className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl  bg-red-100 text-red-600">
                    <Trash2 size={32} />
                </div>

                <h5 className="font-semibold text-lg mb-3">
                    Удалить «{itemName}»?
                </h5>

                <p className="text-sm text-gray-500 mb-4">
                    Это действие нельзя будет отменить. Все данные, связанные с этим элементом, будут удалены навсегда.
                </p>
            </div>
        </Modal>
    )
}