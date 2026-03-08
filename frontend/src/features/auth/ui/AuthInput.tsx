import styles from "./input.module.css";

type Props = {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    rightIcon?: React.ReactNode;
};

export function AuthInput({label, value, onChange, placeholder, type = "text", rightIcon,}: Props) {
    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
                <div className={styles.wrapper}>
                    <input className={styles.input} value={value} type={type} placeholder={placeholder} onChange={onChange}/>
                    {
                        rightIcon && <div className={styles.icon}>{rightIcon}</div>
                    }
                </div>
    </div>);
}