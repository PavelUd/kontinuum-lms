import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import {QuestionBlock} from "@/entities/module-block/ui/question/QuestionBlock";
import {useState} from "react";
import styles from "../question.module.css"


type Props = {
    content: QuestionBlockContent;
}

export function OpenQuestionBlock({ content }: Props) {

    const [inputValue, setInputValue] = useState('');

    return (
        <QuestionBlock content={{
            question: content.question,
            description: content.description,
            correctAnswer: content.correctAnswer,
        }}>

            <input
                type="text"
                className={styles.quizInput}
                placeholder="Введите ваш ответ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </QuestionBlock>
    )
}
