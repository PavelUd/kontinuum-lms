import styles from "./upload.module.css"

type UploadLoaderProps = {
    progress: number,
    uploadSizeClass : string
}

export function UploadLoader({ progress, uploadSizeClass }: UploadLoaderProps) {
    return (
        <div className={`${styles.uploadZoneBase} ${styles.uploadingPlaceholder} ${uploadSizeClass}`}>

            <div className={styles.circleLoader}>
                <svg className={styles.circleSvg} viewBox="0 0 36 36">

                    <path
                        className={styles.circleBg}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />

                    <path
                        className={styles.circleProgress}
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />

                </svg>

                <div className={styles.circleText}>
                    {Math.round(progress)}%
                </div>
            </div>

            <div>
                Загрузка...
            </div>

        </div>
    )
}