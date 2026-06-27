import {EditBlockProps} from "@/entities/module-block/model/types";
import styles from "./page-break.module.css"
import {FileMinus} from "lucide-react";
import {PageBreakBlockContent} from "@/entities/module-block/ui/page-break/page-break-content";

export function EditPageBreakBlock({ block,
                                     isActive,
                                     updateBlock
                                 } : EditBlockProps<PageBreakBlockContent>) {
    return (
        <div className="py-4 text-center">
            <div className="inline-flex w-full items-center gap-3">
                <div className="flex-1 border-b border-dashed opacity-25"></div>

                <div className="inline-flex items-center rounded-full border bg-gray-100 px-3 py-2 font-bold text-gray-500">
                    <FileMinus size={14} className="mr-2" />
                    СЛЕДУЮЩАЯ СТРАНИЦА
                </div>

                <div className="flex-1 border-b border-dashed opacity-25"></div>
            </div>

            <div className="mt-3">
                <div
                    className={styles.continueBtnPreview}
                    contentEditable={isActive}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlock(block.id, { label: e.target.innerText })}
                    dangerouslySetInnerHTML={{ __html: block.content.label }}
                />

                <div className="mt-2 text-sm text-gray-500">
                    Кнопка перехода к следующей части
                </div>
            </div>
        </div>
    );
}