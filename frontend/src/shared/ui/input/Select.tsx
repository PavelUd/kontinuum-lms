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
            <div className={clsx("flex flex-col mb-1", className)}>

                {label && (
                    <label className="mb-2 text-sm font-medium text-gray-600">
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    className={clsx(
                        styles.formInputCustom,
                        "transition rounded-lg px-3 py-2 border",
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
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
                    <span className="mt-1 text-sm text-gray-500">
                        {hint}
                    </span>
                )}

                {error && (
                    <span className="mt-1 text-sm text-red-500">
                        {error}
                    </span>
                )}

            </div>
        )
    }
);

Select.displayName = "Select"