'use client'

import {CalloutBlockContent} from "@/entities/module-block/model/types";
import {Info} from "lucide-react";
import styles from "@/entities/module-block/ui/callout/callout.module.css"
import {CALLOUT_TITLES} from "@/entities/module-block/ui/callout/types";

type Props = {
    content: CalloutBlockContent;
}

export function CalloutBlock({ content }: Props) {

    const type = content.variant.toLowerCase();

    return (
        <div className={`${styles.calloutBlock} ${styles[`callout-${type}`]}`}>
            <div className={styles.calloutTitle}>
                <div className="flex items-center gap-2">
                    <Info size={18} />
                    <span>{CALLOUT_TITLES[type]}</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content.text }}></div>
        </div>
    )
}