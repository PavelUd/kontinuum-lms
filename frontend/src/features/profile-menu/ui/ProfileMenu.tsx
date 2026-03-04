'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Settings, LogOut, Command } from 'lucide-react'
import { UserAvatar } from '@/entities/user/ui/UserAvatar'
import styles from '@/shared/ui/dropdown/Dropdown.module.css'

type Props = {
    name: string
    email: string
}

export function ProfileMenu({ name, email }: Props) {
    return (
        <Menu as="div" className={styles.dropdown}>
            {/* Trigger */}
            <Menu.Button>
                <UserAvatar name={name} />
            </Menu.Button>

            {/* Dropdown */}
            <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-150 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
            >
                <Menu.Items
                    className={styles.dropdownMenu}
                    style={{ right: 0, left: 'auto' }} // align="right"
                >
                    {/* Profile */}
                    <div className="px-3 py-2">
                        <div className="text-lg font-bold">{name}</div>
                        <div className="text-muted">{email}</div>
                    </div>

                    <div className={styles.dropdownDivider} />

                    {/* Methodist panel */}
                    <Menu.Item>
                        {({ active }) => (
                            <div
                                className={`${styles.dropdownItem} font-semibold ${
                                    active
                                        ? 'bg-[rgb(var(--primary))/0.1] text-[rgb(var(--primary))]'
                                        : ''
                                }`}
                            >
                                <Command size={16} />
                                Панель методиста
                            </div>
                        )}
                    </Menu.Item>

                    {/* Settings */}
                    <Menu.Item>
                        {({ active }) => (
                            <div
                                className={`${styles.dropdownItem} ${
                                    active
                                        ? 'bg-[rgb(var(--primary))/0.1] text-[rgb(var(--primary))]'
                                        : ''
                                }`}
                            >
                                <Settings size={16} />
                                Настройки
                            </div>
                        )}
                    </Menu.Item>

                    {/* Logout */}
                    <Menu.Item>
                        {({ active }) => (
                            <div
                                className={`${styles.dropdownItem} ${
                                    active ? 'bg-red-100 text-red-500' : ''
                                }`}
                            >
                                <LogOut size={16} />
                                Выход
                            </div>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}