"use client"

import * as Dialog from "@radix-ui/react-dialog"
import styles from "./curriculum-sidebar.module.css"
import {X} from "lucide-react";

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const modules = [
    { id: 1, title: "Введение", status: "completed" },
    { id: 2, title: "Производная", status: "active" },
    { id: 3, title: "Интегралы", status: "locked" }
]

export function CurriculumSidebar({ open, onOpenChange }: Props) {

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>

            <Dialog.Portal>

                <Dialog.Overlay className={styles.overlay} />

                <Dialog.Content className={styles.sidebar}>

                    <div className={styles.header}>
                        <Dialog.Title>Программа курса</Dialog.Title>

                        <Dialog.Close className={styles.closeBtn}>
                            <X size={34} />
                        </Dialog.Close>
                    </div>

                    <div className={styles.body}>
                        {modules.map(l => (
                            <div
                                key={l.id}
                                className={`${styles.lessonItem} ${l.status === "active" ? styles.active : ""}`}
                            >
                                {l.title}
                            </div>
                        ))}
                    </div>

                </Dialog.Content>

            </Dialog.Portal>

        </Dialog.Root>
    )
}