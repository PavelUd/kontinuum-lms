"use client"

import {QuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "./question.module.css"
import {useState} from "react";
import {useSubmitAnswerMutation} from "@/entities/progress/model/useSubmitAnswerMutation";

type Props = {
    id: string,
    content: QuestionBlockContent;
    isCompleted: boolean
    children: (args: { isAnswered: boolean,answer : string, setAnswer: React.Dispatch<React.SetStateAction<string>> }) => React.ReactNode;
}

export function QuestionBlock({ content,id,isCompleted, children }: Props) {
    
    const mutations = useSubmitAnswerMutation();
    const { description, question } = content;
    const [isAnswered, setIsAnswered] = useState(isCompleted);

    const [answer, setAnswer] = useState<string>("");

    const handleCheck = () => {
        setIsAnswered(true);
        mutations.mutate({
            id: id,
            data: {
                payload : {
                    answer: answer
                }
            }
        });
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