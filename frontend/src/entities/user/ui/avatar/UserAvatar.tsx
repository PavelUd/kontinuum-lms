'use client'

import styles from './user-avatar.module.css'

type Props = {
    name: string
    onClick?: () => void
}

export function UserAvatar({ name, onClick }: Props) {
    return (
        <div onClick={onClick} className={styles.userAvatar}>
            {name.slice(0, 2).toUpperCase()}
        </div>
    )
}