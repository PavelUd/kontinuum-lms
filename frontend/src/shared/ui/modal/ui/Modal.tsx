"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode } from "react"
import styles from "./modal.module.css"

type Props = {
    open: boolean
    onClose: () => void

    title?: ReactNode
    subtitle?: ReactNode

    children: ReactNode
    footer?: ReactNode

    loading?: boolean
    width?: number | string
}

export function Modal({
                          open,
                          onClose,
                          title,
                          subtitle,
                          children,
                          footer,
                          loading,
                          width = 720
                      }: Props) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as="div"
                className={styles.modalRoot}
                onClose={onClose}
            >
                {/* overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={styles.modalOverlay} />
                </Transition.Child>

                <div className={styles.modalContainer}>
                    {/* modal */}
                    <Transition.Child
                        as={Fragment}
                        enter="k-modal-enter"
                        enterFrom="k-modal-enter-from"
                        enterTo="k-modal-enter-to"
                        leave="k-modal-leave"
                        leaveFrom="k-modal-leave-from"
                        leaveTo="k-modal-leave-to"
                    >
                        <Dialog.Panel
                            className={styles.modal}
                            style={{ width: width }}
                        >
                            <div className={styles.modalHeader}>
                            {/* HEADER */}
                                    <div>
                                        {title && (
                                            <Dialog.Title className={styles.modalTitle}>
                                                {title}
                                            </Dialog.Title>
                                        )}

                                        {subtitle && (
                                            <p className={styles.modalSubtitle}>
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>
                                <button
                                onClick={onClose}
                                className={styles.modalClose}
                            >
                                ✕
                            </button>
                            </div>


                            {/* BODY */}
                            <div className={styles.modalContent}>
                                {children}
                            </div>

                            {/* FOOTER */}
                            {footer && (
                                <div>
                                    {footer}
                                </div>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}