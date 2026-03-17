import {EditBlockProps} from "@/entities/module-block/model/types";
import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "./question.module.css"

type EditQuestionBlockProps = EditBlockProps<QuestionBlockContent> & {
    children?: React.ReactNode;
};

export function EditQuestionBlock({
                                      block,
                                      isActive,
                                      updateBlock,
                                      children
                                  }: EditQuestionBlockProps) {

    const { question, description } = block.content;

    return (
        <div className={`${styles.quizCard} ${isActive ? styles.editorMode : ''}`}>

            {/* Вопрос */}
            <div
                className={styles.quizQuestion}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={(e) =>
                    updateBlock(block.id, {
                        ...block.content,
                        question: e.currentTarget.innerText
                    })
                }
                data-placeholder="Введите текст вопроса..."
                dangerouslySetInnerHTML={{ __html: question || "" }}
            />

            {/* Описание */}
            {(isActive) && (
                <div
                    className={styles.quizDescription}
                    contentEditable={isActive}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                        updateBlock(block.id, {
                            ...block.content,
                            description: e.currentTarget.innerText
                        })
                    }
                    data-placeholder="Добавьте описание (необязательно)..."
                    dangerouslySetInnerHTML={{ __html: description && description !== "<br>" ? description : "" }}
                />
            )}

            {/* Контент конкретного типа вопроса */}
            {children}

        </div>
    );
}