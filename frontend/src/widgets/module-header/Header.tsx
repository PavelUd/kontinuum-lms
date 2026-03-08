import { StreakBadge } from "@/entities/streak/ui/StreakBadge";
import { ProfileMenu } from "@/features/profile-menu/ui/ProfileMenu";
import { ChevronLeft, List } from "lucide-react";
import styles from "./header.module.css";
import Link from "next/link"
import { User } from "@/entities/user/models/types";

type Props = {
    onOpenSidebar: () => void
    profile?: User
}

export function Header({onOpenSidebar, profile} : Props ) {
    return (
        <header className={styles.lessonHeader}>
            <div className={styles.lessonHeaderContainer}>
                <div className={styles.lessonHeaderInner}>

                    {/* LEFT */}
                    <div className={styles.lessonHeaderLeft}>
                        <Link href="/">
                            <button className={styles.backBtn}>
                                <ChevronLeft size={24}/>
                                <span className={styles.btnText}>Назад к курсу</span>
                            </button>
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className={styles.lessonHeaderRight}>
                        <button className={styles.outlineBtn}  onClick={onOpenSidebar}>
                            <List size={24} />
                            <span className={styles.outlineText}>Оглавление</span>
                        </button>

                        <StreakBadge value={12} />
                        <ProfileMenu name={profile?.fullName} email={profile?.email} />
                    </div>

                </div>
            </div>
        </header>
    )
}