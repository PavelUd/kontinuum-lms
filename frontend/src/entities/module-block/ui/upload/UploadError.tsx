import styles from "./upload.module.css"

type UploadErrorProps = {
    onRetry: () => void
}

export function UploadError({ onRetry }: UploadErrorProps) {
    return (
        <div className={styles.errorPlaceholder}>
            <div className={styles.errorIcon}>⚠</div>

            <div className={styles.errorText}>
                Не удалось загрузить файл
            </div>

            <button
                className={styles.retryBtn}
                onClick={(e) => {
                    e.stopPropagation()
                    onRetry()
                }}
            >
                Загрузить другое
            </button>
        </div>
    )
}