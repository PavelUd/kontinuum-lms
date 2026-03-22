'use client'

import {LogOut, Settings} from "lucide-react";
import styles from "./admin-sidebar.module.css";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {routes} from "@/features/admin-sidebar/model/types";
import {AdminUserAvatar} from "@/entities/user/ui/AdminUserAvatar";
import {useProfileQuery} from "@/entities/user/models/useUsersQuery";
import {Loader} from "@/shared/ui/loader";
import {RoleMap} from "@/entities/user/models/types";
import {useLogout} from "@/features/auth/model/useLogout";


export function AdminSidebar() {
    const {
        data: profileData,
        isLoading: profileLoading,
        isError: profileError
    } = useProfileQuery();

    const pathname = usePathname();

    const logoutMutation = useLogout()

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    if (profileLoading) return <Loader />
    if (profileError) return <div>Ошибка загрузки</div>

    const profile = profileData?.data;
    const fullName = profile?.fullName ?? "";
    const role = profile ? RoleMap[profile.role] ?? "" : "";

    const isActive = (path?: string | null) => {
        const target = path ?? "/dashboard/courses"; // дефолт
        return pathname?.startsWith(target);
    };

    return (
        <div className={styles.sidebar}>
            {/* HEADER */}
            <div className={styles.header}>
                <h4 className={styles.title}>Континуум</h4>
                <span className={styles.subtitle}>Панель методиста</span>
            </div>

            {/* NAV */}
            <nav className={styles.nav}>
                {routes.map((route) => {
                    const Icon = route.icon;

                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`${styles.navItem} ${
                                isActive(route.href) ? styles.active : ""
                            }`}
                        >
                            <div className={styles.iconWrapper}>
                                <Icon size={18} />
                            </div>
                            {route.label}
                        </Link>
                    );
                })}
            </nav>

            {/* FOOTER */}
            <div className={styles.footer}>
                <Link href="settings.html" className={styles.navItem}>
                    <div className={styles.iconWrapper}><Settings size={18} /></div>
                    Настройки
                </Link>
                <div onClick={handleLogout} className={styles.navItem} style={{ color: "#dc2626", cursor: "pointer" }}>
                    <div className={styles.iconWrapper}><LogOut  size={18} /></div>
                    Выйти
                </div>

                <hr className={styles.divider} />

                <div className={styles.user}>
                    <AdminUserAvatar name={fullName}></AdminUserAvatar>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{fullName}</div>
                        <div className={styles.userRole}>{role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}