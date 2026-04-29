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
            {({ isAnswered, answer, setAnswer }) => (
            <input
                type="text"
                className={`${styles.quizInput} ${isAnswered ? styles.disabled : ""}`}
                placeholder="Введите ваш ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
        )}
        </QuestionBlock>
    )
}
