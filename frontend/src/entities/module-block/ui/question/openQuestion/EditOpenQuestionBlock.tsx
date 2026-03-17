import {EditBlockProps} from "@/entities/module-block/model/types";
import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import {EditQuestionBlock} from "@/entities/module-block/ui/question/EditQuestionBlock";
import styles from "../question.module.css"
import { useRef } from "react"

export function EditOpenQuestionBlock({block, isActive,setActiveBlock, updateBlock}: EditBlockProps<QuestionBlockContent>) {

    const localValueRef = useRef("");

    return (
        <EditQuestionBlock block={block} isActive={isActive} setActiveBlock={setActiveBlock} updateBlock={updateBlock}>
            <div className={styles.answerWrapper}>
                <input className={styles.quizInput} placeholder="Поле для ввода ответа..." disabled />
                {isActive && (
                    <div className={styles.answerWrapperActive}>
                        <div className={styles.answerLabel}>
                            Правильный ответ для проверки:
                        </div>
                        <input
                            key={block.id}
                            className={styles.editorInput}
                            placeholder="Введите правильный ответ..."
                            defaultValue={block.content.correctAnswer ?? ""}

                            onChange={(e) => {
                                localValueRef.current = e.target.value;
                            }}

                            onBlur={() => {
                                updateBlock(block.id, {
                                    ...block.content,
                                    correctAnswer: localValueRef.current
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        </EditQuestionBlock>
    )
}