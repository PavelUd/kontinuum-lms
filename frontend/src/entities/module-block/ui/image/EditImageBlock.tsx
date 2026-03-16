import {EditBlockProps} from "@/entities/module-block/model/types";
import {ImageBlockContent} from "@/entities/module-block/ui/image/image-block-content";

import styles from "./image.module.css"
import {ImageUploadPlaceholder} from "@/entities/module-block/ui/image/ImageUploadPlaceholder";
import baseStyles from "../upload/upload.module.css"
import {ImagePreview} from "@/entities/module-block/ui/image/ImagePreview";
import {UploadBlockContainer} from "@/entities/module-block/ui/upload/UploadBlockContainer";


export function EditImageBlock({
                                  block,
                                  updateBlock,
                                    isActive
                              }: EditBlockProps<ImageBlockContent>) {

    const { url, caption } = block.content

    return (<div className={styles.articleImageWrapper}>
            <UploadBlockContainer
                blockId={block.id}
                url={url}
                caption={caption}
                updateBlock={updateBlock}
                previewContainerClass={styles.imagePreviewContainer}
                Preview={({onError}) => (
                    <ImagePreview
                        url={url}
                        onError={onError}/>
                )}
                Placeholder={({triggerUpload, handleDrop, isDragging, setIsDragging}) => (
                    <ImageUploadPlaceholder
                        blockId={block.id}
                        isDragging={isDragging}
                        onClick={triggerUpload}
                        onDrop={handleDrop}
                        setIsDragging={setIsDragging}/>
                )} uploadType={"image"}
                uploadSizeClass={styles.uploadSizeImg}
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