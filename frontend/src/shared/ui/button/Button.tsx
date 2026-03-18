import styles from "./button.module.css";
import clsx from "clsx";

type Variant = "primary" | "danger" | "outline";

type Props = {
    variant?: Variant;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
                           variant = "primary",
                           children,
                           icon,
                           iconPosition = "left",
                           fullWidth,
                           className,
                           ...props
                       }: Props) {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                fullWidth && styles.fullWidth,
                className
            )}
            {...props}
        >
            {icon && iconPosition === "left" && (
                <span className={styles.icon}>{icon}</span>
            )}

            {children}

            {icon && iconPosition === "right" && (
                <span className={styles.icon}>{icon}</span>
            )}
        </button>
    );
}