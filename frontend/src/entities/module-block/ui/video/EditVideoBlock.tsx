import {EditBlockProps} from "@/entities/module-block/model/types";
import {VideoBlockContent} from "@/entities/module-block/ui/video/video-block-content";
import styles from "./video.module.css";
import {VideoPreview} from "@/entities/module-block/ui/video/VideoPreview";
import {UploadBlockContainer} from "@/entities/module-block/ui/upload/UploadBlockContainer";
import {VideoUploadPlaceholder} from "@/entities/module-block/ui/video/VideoUploadPlaceholder";

export function EditVideoBlock({ block, updateBlock }: EditBlockProps<VideoBlockContent>) {

    const { url, caption } = block.content

    return (
        <div className={styles.articleVideoWrapper}>
        <UploadBlockContainer
            blockId={block.id}
            url={url}
            caption={caption}
            updateBlock={updateBlock}
            previewContainerClass={styles.videoPreviewWrapper}
            Preview={({onError}) => (
                <VideoPreview
                    url={url}
                    onError={onError}/>
            )}
            Placeholder={({triggerUpload, handleDrop, isDragging, setIsDragging}) => (
                <VideoUploadPlaceholder
                    blockId={block.id}
                    isDragging={isDragging}
                    onClick={triggerUpload}
                    onDrop={handleDrop}
                    setIsDragging={setIsDragging}/>
            )} uploadType={"video"}
        />
        </div>)
}