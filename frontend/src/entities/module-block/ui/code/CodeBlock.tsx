import {Check, Code, Copy} from "lucide-react";
import {CodeBlockContent} from "@/entities/module-block/ui/code/code-block-content";
import styles from "./code.module.css"
import {useState} from "react";


type Props = {
    content: CodeBlockContent;
}

export function CodeBlock({ content }: Props) {
    const [copied, setCopied] = useState(false);


    const {language, code} = content;

    return (
        <div className={`${styles.codeBlockEditor} ${styles.light}`} data-tracking-id={`code-${language}`}>

            <div className={styles.codeHeader}>
                <div className={styles.codeHeaderLeft}>
                    <Code size={14} className={styles.codeIcon} />
                    <span className={styles.codeLangLabel}>
                        {language.toUpperCase()}
                    </span>
                </div>
                <button
                    className={`${styles.codeCopyBtn} ${copied ? styles.success : ""}`}
                >
                    {copied ? (
                        <Check size={14} className={styles.copyIcon} />
                    ) : (
                        <Copy size={14} className={styles.copyIcon} />
                    )}
                    {copied ? "Успешно!" : "Copy"}
                </button>
            </div>

            <div className={styles.codeContentWrapper}>
        <pre className={styles.codePre}>
            <code>{code}</code>
        </pre>
            </div>

        </div>
    )
}