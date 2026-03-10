"use client"

import * as Dialog from "@radix-ui/react-dialog"
import styles from "./curriculum-sidebar.module.css"
import {X} from "lucide-react";
import {ModuleSidebarItem} from "@/entities/module/ui/ModuleSidebarItem";
import {ModuleSummary} from "@/entities/module";
import Link from "next/link"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void,
    courseId: string,
    modules: ModuleSummary[]
}

export function CurriculumSidebar({ open, onOpenChange, modules, courseId }: Props) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>

            <Dialog.Portal>

                <Dialog.Overlay className={styles.overlay} />

                <Dialog.Content className={styles.sidebar}>

                    <div className={styles.header}>
                        <Dialog.Title>Программа курса</Dialog.Title>

                        <Dialog.Close className={styles.closeBtn}>
                            <X size={24} />
                        </Dialog.Close>
                    </div>

                    <div className={styles.body}>
                        {modules.map((module) =>

                            module.status === "locked" ? (
                                <div key={module.id} className="cursor-not-allowed opacity-60">
                                    <ModuleSidebarItem module={module} />
                                </div>
                            ) : (
                                <Link
                                    key={module.id}
                                    href={`/courses/${courseId}/module/${module.id}`}
                                >
                                    <ModuleSidebarItem module={module} />
                                </Link>
                            )
                        )}
                    </div>

                </Dialog.Content>

            </Dialog.Portal>

        </Dialog.Root>
    )
}