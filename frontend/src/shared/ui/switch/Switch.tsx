import styles from "./swich.module.css";

type Props = {
    checked: boolean;
    label?: string;
    onToggle?: (value: boolean) => void;
};

export function Switch({ checked, label, onToggle }: Props) {
    return (
        <label className={styles.wrapper}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    onToggle?.(e.target.checked)
                }}
                className={styles.input}
            />

            <span className={styles.slider} />

            {label && <span className={styles.label}>{label}</span>}
        </label>
    );
}