import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";
import {Send} from "lucide-react";

export type Props = {
    isOpen : boolean
    onClose: () => void
    isPending: boolean,
    onConfirm: () => void
}

export function PublishLessonModal({isOpen, onClose,isPending, onConfirm }: Props) {

    return (
        <Modal
            title="Публикация урока"
            open={isOpen}
            onClose={onClose}
            width={455}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Публикация..." : "Опубликовать"}
                    </Button>
                </div>
            }
        >
            <div className="text-center p-4">
                <div
                    className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-3xl bg-green-100 text-green-600">
                    <Send size={32} />
                </div>

                <h4 className="mb-3 text-lg font-extrabold text-slate-900">
                    Опубликовать урок?
                </h4>

                <p className="text-[0.95rem] text-slate-500">
                    Текущая версия урока заменит старую и станет доступна всем
                    ученикам мгновенно.
                </p>
            </div>
        </Modal>
    );
}

