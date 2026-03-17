import {ImageBlockContent} from "@/entities/module-block/ui/upload/image/image-block-content";
import {useState} from "react";
import styles from "./image.module.css"

type Props = {
    content: ImageBlockContent
}

export function ImageBlock({ content }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const {url, caption} = content;

    if(url == "" || url == null){
        return null
    }
    return (
        <div className={styles.articleImageWrapper}>
            <img
                src={url}
                className={styles.articleImage}
                alt={caption}
                onClick={() => setIsOpen(true)}
            />
            {caption && <div className={styles.imageCaption}>{caption}</div>}
            {isOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setIsOpen(false)}>
                    <img src={url} className={styles.lightboxImg} alt="Enlarged" />
                </div>
            )}
        </div>
    )
}