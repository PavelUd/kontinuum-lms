'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import styles from './Dropdown.module.css'

type Props = {
    trigger: ReactNode
    children: ReactNode
    align?: 'left' | 'right'
}

export function Dropdown({ trigger, children, align = 'left' }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div className={styles.dropdown} ref={ref}>
            <div onClick={() => setOpen(!open)}>
                {trigger}
            </div>

            <div
                className={`${styles.dropdownMenu} ${open ? styles.show : ''}`}
                style={align === 'right' ? { right: 0, left: 'auto' } : {}}
            >
                {children}
            </div>
        </div>
    )
}