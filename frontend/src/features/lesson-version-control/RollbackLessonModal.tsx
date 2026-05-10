import {Button} from "@/shared/ui/button/Button";
import {RotateCcw, Send} from "lucide-react";
import {Modal} from "@/shared/ui/modal/ui/Modal";

export type Props = {
    isOpen : boolean
    onClose: () => void
    isPending: boolean
    onConfirm: () => void
}

export function RollbackLessonModal({isOpen, onClose,isPending, onConfirm }: Props) {
    return (
        <Modal
            title="Сбросить изменения"
            open={isOpen}
            onClose={onClose}
            width={450}
            footer={
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Сброс..." : "Сбросить изменения"}
                    </Button>
                </div>
            }
        >
            <div className="text-center p-4">
                <div
                    className="
            mx-auto mb-4
            flex h-[72px] w-[72px]
            items-center justify-center
            rounded-3xl
            bg-amber-100 text-amber-600
        "
                >
                    <RotateCcw size={32} />
                </div>

                <h4 className="mb-3 text-lg font-extrabold text-slate-900">
                    Перезаписать черновик?
                </h4>

                <p className="text-[0.95rem] leading-relaxed text-slate-500">
                    Ваши прошлые экспериментальные наработки в черновике будут
                    обнулены, и вместо них сохранятся текущие.
                </p>
            </div>
        </Modal>
    )
}