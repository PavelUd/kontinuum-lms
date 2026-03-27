'use client'

import { ModuleSummary } from '../model/types'
import { CheckCircle, PlayCircle, Lock } from "lucide-react"
import styles from './module-sidebar-item.module.css'
import Skeleton from "react-loading-skeleton";

interface Props {
    module: ModuleSummary,
    isCurrent?: boolean,
    progress?: number,
    isLoading: boolean
}

export function ModuleSidebarItem({ module, isCurrent, progress, isLoading }: Props) {



    const state = isCurrent ? styles.current : "";
    const locked = module.status == "archived"

    if(isLoading){
        return <Skeleton className={`${styles.moduleRow}`} ></Skeleton>
    }

    return (
        <div className={`${styles.moduleRow} ${state} `}>

            <div className={styles.moduleNum}>
                {module.orderIndex}
            </div>

            <div className={styles.moduleContent}>

                <div className={styles.moduleTitle}>
                    {module.title}
                </div>

                {progress && progress > 79 && (
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                        Пройдено
                    </span>
                )}

                {(!progress || progress < 79) &&  module.status === "active" && (
                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                        Изучаете сейчас
                    </span>
                )}

                { locked && (
                    <span className={`${styles.badge} ${styles.badgeLocked}`}>
                        Доступно позже
                    </span>
                )}

            </div>

            <div>

                {progress && progress > 79 && (
                    <CheckCircle size={18} className={styles.iconActive} />
                )}

                {(!progress || progress < 79) && module.status === "active" && (
                    <PlayCircle size={18} className={styles.iconActive} />
                )}

                {locked && (
                    <Lock size={18} />
                )}

            </div>

        </div>
    )
}