'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Flame,
    Gift,
    Grid,
    Layout,
    Settings,
    LogOut,
    Command,
    Menu,
} from 'lucide-react'

type HeaderProps = {
    userName: string
    userEmail: string
    streak?: number
    myCourses?: string[]
}

export function Header({
                           userName,
                           userEmail,
                           streak = 12,
                           myCourses = [],
                       }: HeaderProps) {
    const [openCourses, setOpenCourses] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const refCourses = useRef<HTMLDivElement>(null)
    const refProfile = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (refCourses.current && !refCourses.current.contains(e.target as Node)) {
                setOpenCourses(false)
            }
            if (refProfile.current && !refProfile.current.contains(e.target as Node)) {
                setOpenProfile(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-black/5">
            <div className="container-custom py-4 flex items-center justify-between">

                <div className="text-2xl font-extrabold tracking-tight">
                    Континуум
                </div>

                <div className="hidden lg:flex items-center gap-6">

                    {/* Мои курсы */}
                    <div className="relative" ref={refCourses}>
                        <button
                            onClick={() => setOpenCourses(!openCourses)}
                            className="flex items-center gap-2 font-medium hover:text-primary transition"
                        >
                            <Layout size={18} />
                            Мои курсы
                        </button>

                        {openCourses && (
                            <div className="absolute mt-3 w-64 bg-white shadow-xl rounded-xl p-3 animate-dropdown">
                                {myCourses.map((c, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 rounded-lg hover:bg-black/5 cursor-pointer text-sm"
                                    >
                                        {c}
                                    </div>
                                ))}
                                <div className="mt-2 pt-2 border-t text-sm text-muted hover:text-primary cursor-pointer">
                                    Все мои курсы
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="flex items-center gap-2 font-medium hover:text-primary transition">
                        <Grid size={18} />
                        Все курсы
                    </button>

                    <button className="flex items-center gap-2 font-medium hover:text-primary transition">
                        <Gift size={18} />
                        Подарок за друга
                    </button>

                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 font-semibold">
                        <Flame size={16} />
                        {streak}
                    </div>

                    <button className="px-4 py-2 rounded-full bg-[rgb(var(--primary))] font-semibold shadow-md hover:-translate-y-0.5 transition">
                        Купить курс
                    </button>

                    {/* Профиль */}
                    <div className="relative" ref={refProfile}>
                        <div
                            onClick={() => setOpenProfile(!openProfile)}
                            className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center font-bold cursor-pointer"
                        >
                            {userName.slice(0, 2).toUpperCase()}
                        </div>

                        {openProfile && (
                            <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl p-3 animate-dropdown">
                                <div className="px-3 py-2">
                                    <div className="font-semibold">{userName}</div>
                                    <div className="text-sm text-muted">{userEmail}</div>
                                </div>

                                <div className="mt-2 border-t pt-2 space-y-1">
                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-primary font-semibold">
                                        <Command size={16} />
                                        Панель методиста
                                    </div>

                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer">
                                        <Settings size={16} />
                                        Настройки
                                    </div>

                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-lg cursor-pointer text-red-500">
                                        <LogOut size={16} />
                                        Выход
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    )
}