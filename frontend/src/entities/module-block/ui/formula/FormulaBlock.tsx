import {FormulaBlockContent} from "@/entities/module-block/ui/formula/formula-block-content";
import katex from "katex";
import {useMemo} from "react";
import {Variable} from "lucide-react";
import styles from "./formula.module.css"


type Props = {
    content: FormulaBlockContent;
}

export function FormulaBlock({ content }: Props) {
    const html = useMemo(() => {
        return katex.renderToString(content.formula, {
            throwOnError: false,
            displayMode:  false
        })
    }, [content.formula])

    return (
        <div className={styles.formulaBlockEditor} data-tracking-id="formula">
        <div className={styles.formulaTitle}>
            <Variable size={18} className={styles.formulaIcon} />
            <span className={styles.formulaLabel}>Формула</span>
        </div>
            <div className={styles.formulaDisplay} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}