'use client'

import { ModuleSummary } from '../model/types'
import { CheckCircle, PlayCircle, Lock } from "lucide-react"
import styles from './module-sidebar-item.module.css'

interface Props {
    module: ModuleSummary,
    isCurrent?: boolean,
}

export function ModuleSidebarItem({ module, isCurrent }: Props) {



    const state = isCurrent ? styles.current : "";
    const locked = state === "locked"

    return (
        <div className={`${styles.moduleRow} ${state}`}>

            <div className={styles.moduleNum}>
                {module.orderIndex}
            </div>

            <div className={styles.moduleContent}>

                <div className={styles.moduleTitle}>
                    {module.title}
                </div>

                {module.status === 3 && (
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        Пройдено
                    </span>
                )}

                {module.status === "active" && (
                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                        Изучаете сейчас
                    </span>
                )}

                {locked && (
                    <span className={`${styles.badge} ${styles.badgeLocked}`}>
                        Доступно позже
                    </span>
                )}

            </div>

            <div>

                {module.status === 3 && (
                    <CheckCircle size={18} className={styles.iconActive} />
                )}

                {module.status === "active" && (
                    <PlayCircle size={18} className={styles.iconActive} />
                )}

                {locked && (
                    <Lock size={18} />
                )}

            </div>

        </div>
    )
}