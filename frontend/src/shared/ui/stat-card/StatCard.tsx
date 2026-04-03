import styles from "./stat-card.module.css"


type StatCardProps = {
    label: string;
    value: React.ReactNode;
    valueClassName?: string;
};

export function StatCard({label, value, valueClassName}: StatCardProps) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statLabel}>{label}</div>
            <div className={`${valueClassName} ${styles.statValue}`}>
                {value}
            </div>
        </div>
    );
}