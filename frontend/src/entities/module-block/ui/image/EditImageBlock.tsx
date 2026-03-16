

import {EditBlockProps} from "@/entities/module-block/model/types";
import {ImageBlockContent} from "@/entities/module-block/ui/image/image-block-content";
import {useRef, useState} from "react";
import styles from "./image.module.css"
import {deleteFile, getUploadUrl} from "@/entities/module-block/api/module-block-files.api";
import {uploadFileToPresignedUrl} from "@/shared/api/files/file-api";
import {ImageUploadPlaceholder} from "@/entities/module-block/ui/image/ImageUploadPlaceholder";
import {UploadError} from "@/entities/module-block/ui/upload/UploadError";
import {ImagePreview} from "@/entities/module-block/ui/image/ImagePreview";
import {UploadLoader} from "@/entities/module-block/ui/upload/UploadLoader";

export function EditImageBlock({
                                   block,
                                   isActive,
                                   updateBlock
                               }: EditBlockProps<ImageBlockContent>) {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadedFile, setUploadedFile] = useState(false);
    const handleRemoveImage = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            if(uploadedFile) {
                await deleteFile(block.id);
                setUploadedFile(false);
            }
            updateBlock(block.id, {
                url: "",
                caption
            });

        } catch (error) {
            console.error("Ошибка удаления файла", error);
        }
    };

    const { url, caption } = block.content;

    const [isDragging, setIsDragging] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();

        setIsDragging(null);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        await uploadFile(file);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        try {

            setUploading(true);
            setProgress(0);

            const presigned = await getUploadUrl(block.id, {
                fileName: file.name,
                contentType: file.type
            });

            const { uploadUrl, fileUrl } = presigned.data;

            updateBlock(block.id, {
                url: fileUrl,
                caption
            });

            setUploadedFile(true);
            await uploadFileToPresignedUrl(uploadUrl, file, (p) => {
                setProgress(p);
            });

            setUploading(false);

        } catch (e) {
            console.error(e);
            setUploading(false);
            setImgError(true);
        }
    };

    return (
        <div className={styles.articleImageWrapper}>

            <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
            />

            {uploading && (
                <UploadLoader progress={progress} />
            )}

            {!uploading && url && !imgError && (
                <ImagePreview
                    url={url}
                    onError={() => setImgError(true)}
                    onRemove={handleRemoveImage}
                />
            )}

            {!uploading && imgError && (
                <UploadError
                    onRetry={triggerFileUpload}
                />
            )}

            {!uploading && !url && !imgError && (
                <ImageUploadPlaceholder
                    blockId={block.id}
                    isDragging={isDragging}
                    onClick={triggerFileUpload}
                    onDrop={handleDrop}
                    setIsDragging={setIsDragging}
                />
            )}

            <input
                className={styles.editorInput}
                placeholder="Вставить URL изображения..."
                value={uploadedFile ? "" : url}
                disabled={uploading || uploadedFile}
                onChange={(e) => {
                    setImgError(false);
                    updateBlock(block.id, {
                        url: e.target.value,
                        caption
                    });
                }}
            />

            <div
                className={`${styles.editorInput} ${styles.editorInputText}`}
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
    );
}