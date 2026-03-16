import {Download, FileText} from "lucide-react";
import styles from "./file.module.css"

type Props = {
    url?: string;
    caption?: string;
    onError: () => void
};


export function FileBlockPreview({ url = "", caption, onError }: Props) {

    const filename = decodeURIComponent(url.split("/").pop() || "")

    return (
        <div className={styles.fileCard}>
            <div className={styles.fileIcon}>
                <FileText size={24} />
            </div>

            <div className={styles.fileInfo}>
                <div className={styles.fileCaption}>
                    {caption}
                </div>
            </div>

            <a
                href={url}
                download
                onError={onError}
                className={styles.fileDownloadBtn}
                onClick={(e) => e.stopPropagation()}
            >
                <Download size={20} className={styles.fileDownloadIcon} />
            </a>
        </div>
    )
}