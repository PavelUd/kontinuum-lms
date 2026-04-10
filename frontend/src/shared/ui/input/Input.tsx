import clsx from "clsx";
import {forwardRef, InputHTMLAttributes} from "react";
import styles from  "./input.module.css"

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    hint?: string
    fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ label, error, hint, className, fullWidth = true, ...props }, ref) => {
        return (
            <div className={clsx("flex flex-col mb-1", className)}>

                {label && (
                    <label className={styles.formLabelCustom}>
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={clsx(
                        styles.formInputCustom,
                        error && "k-input-error",
                        className
                    )}
                    {...props}
                />

                {hint && !error && (
                    <div >{hint}</div>
                )}

                {error && (
                    <div>{error}</div>
                )}
            </div>
        )
    }
)

Input.displayName = "Input"