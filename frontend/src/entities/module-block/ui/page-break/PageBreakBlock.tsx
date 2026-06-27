import {PageBreakBlockContent} from "@/entities/module-block/ui/page-break/page-break-content";
import {ChevronDown} from "lucide-react";
import styles from "./page-break.module.css"

type Props = {
    content: PageBreakBlockContent;
}

export function PageBreakBlock({ content }: Props) {
    return (<div>
        <div className={styles.pageBreakLabel}>Продолжение ниже</div>
        <div className="text-center">
            <button className={styles.continueBtnPreview} onClick={() => {}}>
                {content.label || "Продолжить изучение"}
                <ChevronDown size={18} className="ml-2" />
            </button>
        </div>
    </div>
    );
}