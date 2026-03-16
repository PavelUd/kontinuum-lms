

import {EditBlockProps} from "@/entities/module-block/model/types";
import {ImageBlockContent} from "@/entities/module-block/ui/image/image-block-content";
import {UploadCloud, X} from "lucide-react";
import {useRef, useState} from "react";
import styles from "./image.module.css"
import {deleteFile, getUploadUrl} from "@/entities/module-block/api/module-block-files.api";
import {uploadFileToPresignedUrl} from "@/shared/api/files/file-api";

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
                <div className={styles.uploadingPlaceholder}>

                    <div className={styles.circleLoader}>
                        <svg className={styles.circleSvg} viewBox="0 0 36 36">

                            <path
                                className={styles.circleBg}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />

                            <path
                                className={styles.circleProgress}
                                strokeDasharray={`${progress}, 100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />

                        </svg>

                        <div className={styles.circleText}>
                            {Math.round(progress)}%
                        </div>
                    </div>

                    <div className={styles.uploadText}>
                        Загрузка изображения...
                    </div>

                </div>
            )}

            {!uploading && url && !imgError ? (

                <div className={styles.imagePreviewContainer}>
                    <img
                        src={url}
                        alt="Uploaded"
                        onError={() => setImgError(true)}
                    />

                    <button
                        className={styles.removeImgBtn}
                        onClick={handleRemoveImage}>
                        <X size={18} />
                    </button>
                </div>

            ) : !uploading && imgError ? (

                <div className={styles.errorPlaceholder}>
                    <div className={styles.errorIcon}>⚠</div>

                    <div className={styles.errorText}>
                        Не удалось загрузить изображение
                    </div>

                    <button
                        className={styles.retryBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            triggerFileUpload();
                        }}
                    >
                        Загрузить другое
                    </button>
                </div>

            ) : !uploading && (

                <div
                    className={`${styles.uploadZone} ${
                        isDragging === block.id ? "active" : ""
                    }`}
                    onClick={triggerFileUpload}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={() => setIsDragging(null)}
                    onDrop={handleDrop}
                >
                    <div className={styles.uploadIconWrapper}>
                        <UploadCloud size={28} className="text-primary" />
                    </div>

                    <div className="fw-bold text-main">
                        Перетащите картинку сюда
                    </div>

                    <div className="small">
                        или кликните для выбора
                    </div>
                </div>

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