import {CreateStudentRequest} from "@/entities/user/models/types";
import { useEffect, useState } from "react"
import {Input} from "@/shared/ui/input/Input";
import {Select} from "@/shared/ui/input/Select";
import {Modal} from "@/shared/ui/modal/ui/Modal";
import {Button} from "@/shared/ui/button/Button";
import {InviteAccessCard} from "@/features/invite-access/InviteAccessCard";


type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data: CreateStudentRequest) => Promise<{ inviteLink: string } | null>
}

const initialForm: CreateStudentRequest = {
    fullName: "",
    class: 9,
    phone: "",
    email: ""
}

export function CreateStudentModal({ isOpen, onClose, onConfirm }: Props) {
    const [form, setForm] = useState<CreateStudentRequest>(initialForm)
    const [step, setStep] = useState<"form" | "invite">("form")
    const [inviteLink, setInviteLink] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = <K extends keyof CreateStudentRequest>(
        key: K,
        value: CreateStudentRequest[K]
    ) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
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

    return (
        <Modal
            title={step === "form" ? "Добавить ученика" : "Ссылка-приглашение"}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                                type="text"
                                label="ФИО"
                                placeholder="Иван Иванов"
                                value={form.fullName}
                                onChange={e => handleChange("fullName", e.target.value)}
                            />

                            <Select
                                className="w-full"
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
                                className="mb-2"
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
                            {step === "invite" && (
                                <div className={"mt-3"}>
                                    <hr className="my-4 mb-5 border-gray-200 opacity-20" />

                                    <InviteAccessCard inviteLink={inviteLink}></InviteAccessCard>
                                </div>
                            )}
        </Modal>
    )
}