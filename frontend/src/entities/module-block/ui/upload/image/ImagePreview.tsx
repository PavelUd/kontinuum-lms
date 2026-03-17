import styles from "./image.module.css"

type ImagePreviewProps = {
    url?: string
    onError: () => void
}

export function ImagePreview({ url ="", onError }: ImagePreviewProps) {
    return (
            <img
                src={url}
                alt="Uploaded"
                onError={onError}
            />
    )
}