'use client'

import { MyCoursesDropdown } from '@/features/my-courses-dropdown/ui/MyCoursesDropdown'
import { ProfileMenu } from '@/features/profile-menu/ui/ProfileMenu'
import { StreakBadge } from '@/entities/streak/ui/StreakBadge'

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
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5">
            <div className="w-full px-8 xl:px-20">
                <div className="flex items-center justify-between h-20">

                    {/* LEFT */}
                    <div className="flex items-center gap-5 flex-1">
                        <div className="text-3xl font-extrabold tracking-tight">
                            Континуум
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-6">
                            <MyCoursesDropdown courses={myCourses} />
                        </div>
                        <StreakBadge value={streak} />
                        <ProfileMenu name={userName} email={userEmail} />
                    </div>

                </div>
            </div>
        </header>
    )
}