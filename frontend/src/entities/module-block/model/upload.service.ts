import {deleteFile, getUploadUrl} from "@/entities/module-block/api/module-block-files.api";
import {uploadFileToPresignedUrl} from "@/shared/api/files/file-api";
import {UploadType} from "@/entities/module-block/model/types";

export type UploadParams = {
    blockId: string
    file: File
    onProgress?: (progress: number) => void
}

const UploadMimeMap: Record<UploadType, string[]> = {
    image: [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif"
    ],

    video: [
        "video/mp4",
        "video/webm",
        "video/ogg"
    ],

    audio: [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg"
    ],

    file: [
        "application/pdf",
        "application/zip",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
}

export class UploadService {


    static async upload({
                            blockId,
                            file,
                            onProgress
                        }: UploadParams) {

        const presigned = await getUploadUrl(blockId, {
            fileName: file.name,
            contentType: file.type
        })

        const { uploadUrl, fileUrl } = presigned.data

        await uploadFileToPresignedUrl(uploadUrl, file, (p) => {
            onProgress?.(p)
        })

        return fileUrl
    }

    static async remove(blockId: string) {
        await deleteFile(blockId)
    }

    static validateUploadFile(
        file: File,
        type: UploadType
    )  {
        const allowed = UploadMimeMap[type]

        if (!allowed.includes(file.type)) {
            return false
        }

        return true
    }
}