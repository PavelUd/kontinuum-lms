import styles from "../question.module.css"
import {
    toggleCorrectAnswer,
    updateOptionText,
    removeOption,
    addOption
} from "./choiceQuestion.actions";
import {EditQuestionBlock} from "@/entities/module-block/ui/question/EditQuestionBlock";
import {ChoiceQuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import {EditBlockProps} from "@/entities/module-block/model/types";
import {Check, Trash} from "lucide-react";

export function EditChoiceQuestionBlock({
                                            block,
                                            isActive,
                                            setActiveBlock,
                                            updateBlock
                                        }: EditBlockProps<ChoiceQuestionBlockContent>) {

    const { variant, correctAnswer, options } = block.content;

    return (
        <EditQuestionBlock
            block={block}
            isActive={isActive}
            setActiveBlock={setActiveBlock}
            updateBlock={updateBlock}
        >
            <div className={styles.quizOptions}>
                {options.map((opt, oIdx) => {

                    const isCorrect = correctAnswer.includes(oIdx.toString());

                    return (
                        <div key={oIdx} className={styles.optionRow}>

                            <div
                                className={`
                                    ${styles.quizOption}
                                    ${variant === "Single" ? styles.single : ""}
                                    ${isCorrect ? styles.selected : ""}
                                `}
                                onClick={() => {
                                    if (!isActive) return;

                                    const newCorrect = toggleCorrectAnswer(
                                        correctAnswer,
                                        oIdx,
                                        variant
                                    );

                                    updateBlock(block.id, { ...block.content, correctAnswer: newCorrect });
                                }}
                            >
                                <div className={styles.optionMarker}>
                                    {isCorrect && <Check size={12} className={styles.checkIcon} />}
                                </div>

                                <div
                                    className={styles.optionText}
                                    contentEditable={isActive}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        const newOptions = updateOptionText(
                                            options,
                                            oIdx,
                                            e.currentTarget.innerText
                                        );

                                        updateBlock(block.id, {
                                            ...block.content,
                                            ...newOptions
                                        });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {opt}
                                </div>
                            </div>

                            {isActive && options.length > 1 && (
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        const result = removeOption(
                                            options,
                                            correctAnswer,
                                            oIdx
                                        );

                                        updateBlock(block.id, {
                                            ...block.content,
                                            ...Object.fromEntries(
                                                Object.entries(result).filter(([_, v]) => v !== undefined)
                                            )
                                        });
                                    }}
                                >
                                    <Trash size={16}></Trash>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {isActive && (
                <button
                    className={styles.addBtn}
                    onClick={(e) => {
                        e.stopPropagation();

                        const newOptions = addOption(options);
                        updateBlock(block.id, { ...block.content, options: newOptions });
                    }}
                >
                    + Добавить вариант
                </button>
            )}
        </EditQuestionBlock>
    );
}