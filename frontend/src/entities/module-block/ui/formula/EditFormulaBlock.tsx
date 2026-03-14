import {FormulaBlockContent} from "@/entities/module-block/ui/formula/formula-block-content";
import katex from "katex";
import {useMemo} from "react";
import {Variable} from "lucide-react";
import styles from "./formula.module.css"
import {EditBlockProps} from "@/entities/module-block/model/types";

export function EditFormulaBlock({block, isActive, updateBlock}: EditBlockProps<FormulaBlockContent>) {

    const content = block.content;
    const html = useMemo(() => {
        const formula = content.formula
        return katex.renderToString(formula, {
            throwOnError: false,
            displayMode: true
        })
    }, [content.formula])

    return (
        <div className={styles.formulaBlockEditor} data-tracking-id="formula">
            <div className={styles.formulaTitle}>
                <Variable size={18} className={styles.formulaIcon} />
                <span className={styles.formulaLabel}>Формула</span>
            </div>
            <div className={styles.formulaDisplay} dangerouslySetInnerHTML={{ __html: html }} />
            <div className={styles.formulaInputWrapper}>
                {isActive && (
                    <>
                        <div className={styles.formulaInputTitle}>КОД LATEX:</div>

                        <textarea
                            className={styles.latexInput}
                            value={content.formula || ''}
                            onChange={(e) => updateBlock(block.id, { formula: e.target.value })}
                            placeholder="Введите формулу..."
                            onClick={(e) => e.stopPropagation() }
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        />

                        <div className={styles.formulaHints}>
                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + '\\frac{a}{b}'
                                    })
                                }}
                            >
                                {`\\frac{a}{b}`}
                            </button>

                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + '\\sqrt{x}'
                                    })
                                }}
                            >
                                {`\\sqrt{x}`}
                            </button>

                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + 'x^2'
                                    })
                                }}
                            >
                                {`x^2`}
                            </button>

                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + '\\Delta'
                                    })
                                }}
                            >
                                {`\\Delta`}
                            </button>

                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + '\\infty'
                                    })
                                }}
                            >
                                {`\\infty`}
                            </button>

                            <button
                                type="button"
                                className={styles.hintBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateBlock(block.id, {
                                        formula: (content.formula || '') + '\\sin(x)'
                                    })
                                }}
                            >
                                {`\\sin(x)`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}