import {FileBlockContent} from "@/entities/module-block/model/types";
import {FileBlockPreview} from "@/entities/module-block/ui/upload/file/FilePreview";
import styles from "./file.module.css";
type Props = {
    content: FileBlockContent
}

export function FileBlock({ content }: Props) {

    const {caption, url} = content

    return (
        <div className={styles.fileBlockWrapper}>
        <FileBlockPreview
            url={url}
            caption={caption}
            onError={() => {}}
        />
        </div>)
}