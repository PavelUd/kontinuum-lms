import styles from "./spoiler.module.css"
import {SpoilerBlockContent} from "@/entities/module-block/ui/spoiler/spoiler-block-content";

import {EditBlockProps} from "@/entities/module-block/model/types";
import {EyeOff} from "lucide-react";


export function EditSpoilerBlock({block, isActive, updateBlock}: EditBlockProps<SpoilerBlockContent>) {

    const {title, text} = block.content

    return (
        <div className={styles.spoilerBlockPreview}>
            <div className={styles.spoilerHeaderPreview}>
                <div className={styles.row}>
                <EyeOff size={18} className={styles.iconMuted} />
                <span
                    contentEditable={isActive}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlock(block.id, { title: e.target.innerText, text: text })}
                    dangerouslySetInnerHTML={{ __html: title }}
                />
                </div>
            </div>
            <div
                className={styles.spoilerContentPreview}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={(e) => updateBlock(block.id, { title: title, text: e.target.innerHTML })}
                dangerouslySetInnerHTML={{ __html: text }}
            >
            </div>
        </div>
    );
}