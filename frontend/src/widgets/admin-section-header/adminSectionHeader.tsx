import styles from "./admin-section-header.module.css";

type AdminSectionHeaderProps = {
    title: string
    subtitle?: string
    actions?: React.ReactNode
}

export function AdminSectionHeader({
                                       title,
                                       subtitle,
                                       actions,
                                   }: AdminSectionHeaderProps) {
    return (
        <div className={styles.headerRow}>
            <div>
                <h2 className={styles.title}>{title}</h2>

                {subtitle && (
                    <p className={styles.subtitle}>
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div>
                    {actions}
                </div>
            )}
        </div>
    )
}