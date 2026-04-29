"use client"

import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "./question.module.css"
import {useState} from "react";

type Props = {
    content: QuestionBlockContent;
    children: (args: { isAnswered: boolean,answer : string, setAnswer: React.Dispatch<React.SetStateAction<string>> }) => React.ReactNode;
}

export function QuestionBlock({ content, children }: Props) {

    const { description, question } = content;
    const [isAnswered, setIsAnswered] = useState(false);

    const [answer, setAnswer] = useState<string>("");

    const handleCheck = () => {
        setIsAnswered(true);
        console.log(answer);
        setAnswer("");
    };

    return (
        <div
            className={`${styles.quizCard} ${isAnswered ? styles.correct : ""}`}
            data-tracking-id={question.substring(0, 20)}
        >
            <div
                className={styles.quizQuestion}
                dangerouslySetInnerHTML={{ __html: question }}
            />

            {description && (
                <div
                    className={styles.quizDescription}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            {children({ isAnswered, answer, setAnswer })}

            <button
                onClick={handleCheck}
                disabled={isAnswered}
                className={styles.checkBtn}
            >
                {isAnswered ? "Ответ принят" : "Проверить"}
            </button>
        </div>
    );
}