export const uploadFileToPresignedUrl = async (
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
) => {

    const xhr = new XMLHttpRequest();

    return new Promise<void>((resolve, reject) => {

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = (event.loaded / event.total) * 100;
                onProgress(percent);
            }
        };

        xhr.onload = () => resolve();
        xhr.onerror = () => reject("Upload failed");

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
    });
};