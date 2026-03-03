'use client'

import { Settings, LogOut, Command } from 'lucide-react'
import { UserAvatar } from '@/entities/user/ui/UserAvatar'
import { Dropdown } from '@/shared/ui/dropdown'
import styles from '@/shared/ui/dropdown/Dropdown.module.css'

type Props = {
    name: string
    email: string
}

export function ProfileMenu({ name, email }: Props) {
    return (
        <Dropdown
            align="right"
            trigger={<UserAvatar name={name} />}
        >
            <div className="px-3 py-2">
                <div className="text-lg font-bold">{name}</div>
                <div className=" text-muted">{email}</div>
            </div>

            <div className={styles.dropdownDivider} />

            <div className={styles.dropdownItem + " font-semibold hover:bg-[rgb(var(--primary))/0.1] hover:text-[rgb(var(--primary))]"}>
                <Command size={16} />
                Панель методиста
            </div>

            <div className={styles.dropdownItem + " hover:bg-[rgb(var(--primary))/0.1] hover:text-[rgb(var(--primary))]"}>
                <Settings size={16} />
                Настройки
            </div>

            <div className={styles.dropdownItem + " hover:bg-red-100 hover:text-red-500"}>
                <LogOut size={16} />
                Выход
            </div>
        </Dropdown>
    )
}