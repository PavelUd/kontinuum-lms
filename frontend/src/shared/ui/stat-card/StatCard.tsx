import styles from "./stat-card.module.css"


type StatCardProps = {
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
    isLoading?: boolean;
};

export function StatCard({ label, value, valueClassName, isLoading }: StatCardProps) {
    if (isLoading) {
        return (
            <div className={`${styles.statCard} ${styles.statCardSkeleton} animate-pulse`}>
                <div className={`${styles.statLabel} opacity-0`}>{"1"}</div>
                <div className={`${valueClassName} ${styles.statValue} opacity-0`}>
                    {"1"}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={`${valueClassName} ${styles.statValue}`}>
                {value}
            </div>
        </div>
    );
}