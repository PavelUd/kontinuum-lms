import {EditBlockProps, FileBlockContent} from "@/entities/module-block/model/types";
import styles from "./file.module.css"
import {UploadBlockContainer} from "@/entities/module-block/ui/upload/UploadBlockContainer";
import {FileUploadPlaceholder} from "@/entities/module-block/ui/file/FileUploadPlaceholder";
import {FileBlockPreview} from "@/entities/module-block/ui/file/FilePreview";
import baseStyles from "@/entities/module-block/ui/upload/upload.module.css";


export function EditFileBlock({ block, updateBlock, isActive }: EditBlockProps<FileBlockContent>) {

    const { url, caption } = block.content

    return (
        <div className={styles.articleFileWrapper}>
            <UploadBlockContainer
                blockId={block.id}
                url={url}
                caption={caption}
                updateBlock={updateBlock}
                previewContainerClass={styles.filePreviewWrapper}
                Preview={({onError}) => (
                    <FileBlockPreview
                        url={url}
                        caption={caption}
                        onError={onError}/>
                )}
                Placeholder={({triggerUpload, handleDrop, isDragging, setIsDragging}) => (
                    <FileUploadPlaceholder
                        blockId={block.id}
                        isDragging={isDragging}
                        onClick={triggerUpload}
                        onDrop={handleDrop}
                        setIsDragging={setIsDragging}/>
                )} uploadType={"file"}
                uploadSizeClass={styles.uploadSizeFile}
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