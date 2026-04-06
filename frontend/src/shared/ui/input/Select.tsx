import { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./input.module.css";

type Option = {
    value: string;
    label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    hint?: string;
    options: Option[];
    fullWidth?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, Props>(
    ({ label, error, hint, className, options, fullWidth = true, ...props }, ref) => {
        return (
            <div className={styles.inputWrapper}>

                {label && (
                    <label className={styles.formLabelCustom}>
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    className={clsx(
                        styles.formInputCustom,
                        error && "k-input-error",
                        className
                    )}
                    {...props}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {hint && !error && (
                    <div>{hint}</div>
                )}

                {error && (
                    <div>{error}</div>
                )}

            </div>
        );
    }
);

Select.displayName = "Select"