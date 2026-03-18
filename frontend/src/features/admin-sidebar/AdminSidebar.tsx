'use client'


import {Book, LogOut, Settings} from "lucide-react";
import styles from "./admin-sidebar.module.css";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {routes} from "@/features/admin-sidebar/model/types";
import {AdminUserAvatar} from "@/entities/user/ui/AdminUserAvatar";


export function AdminSidebar() {

    const DEFAULT_ROUTE = "/dashboard/courses";
    const pathname = usePathname();
    const isActive = (path?: string | null) => {
        const target = path ?? "/dashboard/courses"; // дефолт
        return path?.startsWith(target);
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
                                pathname?.startsWith(route.href) ? styles.active : ""
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
                <a href="" className={styles.navItem}>
                    <div className={styles.iconWrapper}><LogOut size={18} /></div>
                    Выйти
                </a>

                <hr className={styles.divider} />

                <div className={styles.user}>
                    <AdminUserAvatar name={"Аня"}></AdminUserAvatar>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>Аня Ширшова</div>
                        <div className={styles.userRole}>Методист</div>
                    </div>
                </div>
            </div>
        </div>
    );
}