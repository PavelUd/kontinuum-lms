import styles from "./upload.module.css"

type UploadErrorProps = {
    onRetry: () => void
    uploadSizeClass : string
}

export function UploadError({ onRetry, uploadSizeClass }: UploadErrorProps) {
    return (
        <div className={`${styles.uploadZoneBase} ${styles.errorPlaceholder} ${uploadSizeClass}`}>
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