import styles from "./row.module.css";

type Props = {
    children?: React.ReactNode;
    className?: string;
    key : string;
};

export function Row({ children, className }: Props) {
    return (
        <div className={`${styles.row} ${className ?? ''}`}>
            {children}
        </div>
    );
}