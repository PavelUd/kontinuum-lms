import {VideoBlockContent} from "@/entities/module-block/ui/upload/video/video-block-content";
import {VideoPreview} from "@/entities/module-block/ui/upload/video/VideoPreview";
import styles from "./video.module.css"

type Props = {
    content: VideoBlockContent
}

export function VideoBlock({ content }: Props) {
    return (
        <div className={styles.videoBlockWrapper}>
        <VideoPreview
            url={content.url}
            onError={() => {}}/>
        </div>
    )
}