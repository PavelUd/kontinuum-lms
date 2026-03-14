import styles from "./spoiler.module.css"
import {SpoilerBlockContent} from "@/entities/module-block/ui/spoiler/spoiler-block-content";
import {useState} from "react";
import {ChevronDown, ChevronUp, Eye, EyeOff, Icon} from "lucide-react";

type Props = {
    content: SpoilerBlockContent
}

export function SpoilerBlock({ content }: Props) {

    const {title, text} = content
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className={styles.spoilerBlockPreview} data-tracking-id={title}>
        <div
            className={`${styles.spoilerHeaderPreview} ${!isOpen ? styles.noBorder : ''}`}
            onClick={toggle}
        >
            <div className={styles.row}>
                    {isOpen ? (
                        <Eye size={16} className={styles.iconMuted} />
                    ) : (
                        <EyeOff size={16} className={styles.iconMuted} />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                </div>
                {isOpen ? (
                    <ChevronUp size={16} className={styles.iconMuted} />
                ) : (
                    <ChevronDown size={16} className={styles.iconMuted} />
                )}
        </div>
            {isOpen && <div className={styles.spoilerContentPreview } dangerouslySetInnerHTML={{ __html: text }} />}
        </div>
    );
}