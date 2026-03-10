'use client'

import { Flame } from 'lucide-react'
import styles from './StreakBadge.module.css'

type Props = {
    value: number
}

export function StreakBadge({ value }: Props) {
    return (
        <div className={styles.streakBadge}>
            <Flame size={18} className={styles.icon} />
            {value}
        </div>
    )
}