import styles from "./image.module.css"
import {X} from "lucide-react";

type ImagePreviewProps = {
    url: string
    onError: () => void
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

export function ImagePreview({ url, onError, onRemove }: ImagePreviewProps) {
    return (
        <div className={styles.imagePreviewContainer}>
            <img
                src={url}
                alt="Uploaded"
                onError={onError}
            />

            <button
                className={styles.removeImgBtn}
                onClick={onRemove}
            >
                <X size={18} />
            </button>
        </div>
    )
}