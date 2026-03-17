import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "./question.module.css"

type Props = {
    content: QuestionBlockContent;
    children?: React.ReactNode;
}

export function QuestionBlock({ content, children }: Props) {

    const { description, question } = content;

    return (
        <div className={styles.quizCard} data-tracking-id={question.substring(0, 20)}>
            <div className={styles.quizQuestion} dangerouslySetInnerHTML={{ __html:question }} />
            {description && <div className={styles.quizDescription} dangerouslySetInnerHTML={{ __html: description }} />}
            {children}

            <button className={styles.checkBtn}>Проверить</button>
        </div>

    )
}