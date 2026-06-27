import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";
import {useEffect, useState} from "react";
import {EmployeeForm} from "@/features/employee-form/EmployeeForm";
import {CreateStudentRequest, UserRequest} from "@/entities/user/models/types";
import {InviteAccessCard} from "@/features/invite-access/InviteAccessCard";

type Props = {
    onConfirm: (request : UserRequest) => Promise<{ inviteLink: string } | null>;
    isOpen : boolean
    onClose: () => void
}

const initialForm: UserRequest = {
    fullName: "",
    phone: "",
    email: "",
    role: "teacher",
}

export function CreateEmployeeModal({ isOpen, onClose, onConfirm }: Props) {
    const [form, setForm] = useState<UserRequest>(initialForm);
    const [step, setStep] = useState<"form" | "invite">("form")
    const [inviteLink, setInviteLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)

            const result = await onConfirm(form)

            if (!result?.inviteLink) {
                return
            }

            setInviteLink(result.inviteLink)
            setStep("invite")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetState = () => {
        setForm(initialForm)
        setStep("form")
        setInviteLink("")
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (!isOpen) {
            resetState()
        }
    }, [isOpen])


    return (
        <Modal
            title="Добавление сотрудника"
            open={isOpen}
            onClose={onClose}
            width={600}
            footer={
                step === "form" ? (
                    <div className="p-4 py-2 border-t border-gray-100 flex gap-4">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>

                        <Button
                            className="w-full"
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Добавление..." : "Добавить"}
                        </Button>
                    </div>
                ) : (
                    <div className="p-4 py-2 border-t border-gray-100 flex gap-4">
                        <div></div>
                        <Button
                            className="w-full"
                            variant="primary"
                            onClick={onClose}
                        >
                            Готово
                        </Button>
                    </div>
                )
            }
        >
            <EmployeeForm value={form} onChange={setForm} />
            {step === "invite" && (
                <div className={"mt-3"}>
                    <hr className="my-4 mb-5 border-gray-200 opacity-20" />

                    <InviteAccessCard inviteLink={inviteLink}></InviteAccessCard>
                </div>
            )}
        </Modal>
    );
}