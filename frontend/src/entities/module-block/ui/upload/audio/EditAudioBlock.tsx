import {EditBlockProps, FileBlockContent} from "@/entities/module-block/model/types";
import styles from "./audio.module.css"
import baseStyles from "../upload.module.css"
import {UploadBlockContainer} from "@/entities/module-block/ui/upload/UploadBlockContainer";
import {AudioBlockPreview} from "@/entities/module-block/ui/upload/audio/AudioPreview";
import {AudioUploadPlaceholder} from "@/entities/module-block/ui/upload/audio/AudioUploadPlaceholder";

export function EditAudioBlock({ block,isActive, updateBlock }: EditBlockProps<FileBlockContent>) {

    const { url, caption } = block.content

    return (
        <div className={styles.articleAudioWrapper}>
            <UploadBlockContainer
                blockId={block.id}
                url={url}
                caption={caption}
                updateBlock={updateBlock}
                previewContainerClass={styles.audioPreviewWrapper}
                Preview={({onError}) => (
                    <AudioBlockPreview
                        caption={caption}
                        url={url}
                        onError={onError}/>
                )}
                Placeholder={({triggerUpload, handleDrop, isDragging, setIsDragging}) => (
                    <AudioUploadPlaceholder
                        blockId={block.id}
                        isDragging={isDragging}
                        onClick={triggerUpload}
                        onDrop={handleDrop}
                        setIsDragging={setIsDragging}/>
                )} uploadType={"audio"}
                uploadSizeClass={styles.uploadSizeAudio}
            />
            <div
                className={`${baseStyles.editorInput} ${baseStyles.editorInputText}`}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={(e) =>
                    updateBlock(block.id, {
                        url,
                        caption: e.target.innerText
                    })
                }
                dangerouslySetInnerHTML={{ __html: caption ?? "" }}
            />
        </div>

    )
}