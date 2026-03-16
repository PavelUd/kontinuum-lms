import {UploadService} from "@/entities/module-block/model/upload.service";
import {UploadLoader} from "@/entities/module-block/ui/upload/UploadLoader";
import {UploadError} from "@/entities/module-block/ui/upload/UploadError";
import {useRef, useState} from "react";
import styles from "./upload.module.css"
import {X} from "lucide-react";
import {UploadType} from "@/entities/module-block/model/types";

type UploadBlockContainerProps = {
    blockId: string
    url?: string
    caption?: string
    updateBlock: (id: string, data: any) => void
    previewContainerClass: string
    uploadSizeClass : string
    showUrlInput?: boolean
    uploadType : UploadType
    Preview: (props: {
        onError: () => void
    }) => React.ReactNode
    Placeholder: (props: {
        triggerUpload: () => void
        handleDrop: (e: React.DragEvent) => void
        isDragging: string | null
        setIsDragging: (v: string | null) => void
    }) => React.ReactNode
}

export function UploadBlockContainer({
                                         blockId,
                                         url = "",
                                         caption = "",
                                         updateBlock,
                                         previewContainerClass,
                                         uploadSizeClass,
                                         showUrlInput = true,
                                         uploadType,
                                         Preview,
                                         Placeholder
                                     }: UploadBlockContainerProps) {

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const [isDragging, setIsDragging] = useState<string | null>(null)
    const [imgError, setImgError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadedFile, setUploadedFile] = useState(false)

    const triggerUpload = () => {
        fileInputRef.current?.click()
    }

    const uploadFile = async (file: File) => {

        try {

            setUploading(true)
            setProgress(0)
            setImgError(false)

            const fileUrl = await UploadService.upload({
                blockId,
                file,
                onProgress: setProgress
            })

            updateBlock(blockId, {
                url: fileUrl,
                caption
            })

            setUploadedFile(true)

        } catch (error) {

            console.error(error)
            setImgError(true)

        } finally {

            setUploading(false)

        }

    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]

        if (!file) return
        if (!UploadService.validateUploadFile(file, uploadType)) {

            setImgError(true)

            console.error("Недопустимый тип файла:", file.type)

            return
        }
        await uploadFile(file)

    }

    const handleDrop = async (e: React.MouseEvent) => {

        e.stopPropagation()

        try {

            if (uploadedFile) {
                await UploadService.remove(blockId)
                setUploadedFile(false)
            }

            updateBlock(blockId, {
                url: "",
                caption
            })

        } catch (error) {

            console.error(error)

        }

    }

    return (
        <>

            <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
            />

            {uploading && <UploadLoader progress={progress} uploadSizeClass={uploadSizeClass} />}

            {!uploading && url && !imgError && (
                <div className={previewContainerClass}>
                    {Preview(
                        {onError: () => setImgError(true)}
                    )}

                    <button
                        className={styles.removeImgBtn}
                        onClick={handleDrop}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {!uploading && imgError && (
                <UploadError onRetry={triggerUpload}  uploadSizeClass={uploadSizeClass}/>
            )}

            {!uploading && !url && !imgError &&
                Placeholder({
                    triggerUpload,
                    handleDrop,
                    isDragging,
                    setIsDragging
                })}

            {showUrlInput && !url && !uploadedFile && !uploading && (
                <input
                    className={styles.editorInput}
                    placeholder="Вставить URL..."
                    value={url}
                    onChange={(e) => {

                        setImgError(false)

                        updateBlock(blockId, {
                            url: e.target.value,
                            caption
                        })

                    }}
                />
            )}
        </>
    )
}