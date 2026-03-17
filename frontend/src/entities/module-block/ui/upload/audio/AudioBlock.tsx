
import {FileBlockContent} from "@/entities/module-block/model/types";
import {AudioBlockPreview} from "@/entities/module-block/ui/upload/audio/AudioPreview";
import styles from "./audio.module.css"

type Props = {
    content: FileBlockContent
}

export function AudioBlock({ content }: Props) {

    const { url, caption} = content

    return (
        <div className={styles.audioBlockWrapper}>
        <AudioBlockPreview
            url={url}
            caption={caption}
            onError={() => {}}
        />
        </div>)
}