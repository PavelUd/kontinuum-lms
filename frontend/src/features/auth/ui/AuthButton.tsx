import styles from "./button.module.css";

type Props = {
    children: React.ReactNode;
    type?: "button" | "submit";
    disabled?: boolean
};

export function AuthButton({ children, type = "button", disabled }: Props) {
    return (
        <button type={type} className={styles.button} disabled={disabled}>
            {children}
        </button>
    );
}