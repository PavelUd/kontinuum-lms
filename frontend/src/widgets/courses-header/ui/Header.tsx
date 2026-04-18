'use client'

import { MyCoursesDropdown } from '@/features/my-courses-dropdown/ui/MyCoursesDropdown'
import { ProfileMenu } from '@/features/profile-menu/ui/ProfileMenu'
import { StreakBadge } from '@/entities/streak/ui/StreakBadge'
import {CourseSummary} from "@/entities/course";
import {User} from "@/entities/user/models/types";

type HeaderProps = {
    profile?: User,
    streak?: number
    courses?: CourseSummary[]
}

export function Header({
                           profile,
                           streak = 12,
                           courses = [],
                       }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5">
            <div className="w-full px-8 xl:px-20">
                <div className="flex items-center justify-between h-17">

                    {/* LEFT */}
                    <div className="flex items-center gap-5 flex-1">
                        <div className="text-2xl font-extrabold tracking-tight">
                            Континуум
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-6">
                            <MyCoursesDropdown courses={courses} />
                        </div>
                        <ProfileMenu name={profile?.fullName ?? ""} email={profile?.email ?? ""} />
                    </div>

                </div>
            </div>
        </header>
    )
}