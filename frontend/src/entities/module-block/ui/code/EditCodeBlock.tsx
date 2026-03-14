import {EditBlockProps} from "@/entities/module-block/model/types";
import {CodeBlockContent} from "@/entities/module-block/ui/code/code-block-content";
import styles from "./code.module.css"
import {Code, Copy} from "lucide-react";

export function EditCodeBlock({
                                  block,
                                  isActive,
                                  updateBlock
                              }: EditBlockProps<CodeBlockContent>) {

    const {language, code} = block.content
    const LANGUAGES = [
        {value: "python", label: "Python"},
        {value: "pascal", label: "Pascal"},
        {value: "kumir", label: "КуМир"}
    ]
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateBlock(block.id, {
            language: e.target.value,
            code
        })
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBlock(block.id, {
            language,
            code: e.target.value
        })
    }

    return (
        <div className={`${styles.codeBlockEditor} ${styles.light}`}>

            <div className={styles.codeHeader}>

                <div className={styles.codeHeaderLeft}>
                    <Code size={14} className={styles.codeIcon}/>

                    <select
                        className={styles.codeLangSelect}
                        value={language || "python"}
                        onChange={handleLanguageChange}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>

                </div>

                <button
                    className={styles.codeCopyBtn}
                >
                    <Copy size={14} className={styles.copyIcon}/>
                    Copy
                </button>

            </div>

            <div className={styles.codeContentWrapper}>
                <textarea
                    className={styles.codeTextarea}
                    value={code || ""}
                    onChange={handleCodeChange}
                    placeholder="Введите код здесь..."
                    spellCheck={false}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

        </div>
    )
}