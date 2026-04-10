import styles from "./badge.module.css"

export type BadgeVariant =
    | "red"
    | "blue"
    | "green"
    | "yellow"
    | "gray";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    gray: "bg-gray-100 text-gray-600",
};

export function Badge({ children, variant = "gray", className }: BadgeProps) {
    return (
        <span
            className={`
                ${styles.badge}
                ${VARIANT_STYLES[variant]}
                ${className ?? ""}
            `}
        >
            {children}
        </span>
    );
}