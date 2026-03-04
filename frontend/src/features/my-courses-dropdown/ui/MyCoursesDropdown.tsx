'use client'

import { Layout } from 'lucide-react'
import { Dropdown } from '@/shared/ui/dropdown'
import styles from '@/shared/ui/dropdown/Dropdown.module.css'

type Props = {
    courses: string[]
}

export function MyCoursesDropdown({ courses }: Props) {
    return (
        <Dropdown
            trigger={
                <div className="flex items-center gap-2 font-semibold cursor-pointer me-3">
                    <Layout size={24} />
                    <span className="text-xl font-semibold tracking-tight">Мои курсы</span>
                </div>
            }
        >
            {courses.map((c, i) => (
                <div key={i} className={styles.dropdownItem}>
                    {c}
                </div>
            ))}

            <div className={styles.dropdownDivider} />

            <div className={styles.dropdownItem}>
                Все мои курсы
            </div>
        </Dropdown>
    )
}