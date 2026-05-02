import {ChoiceQuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "@/entities/module-block/ui/question/question.module.css";
import {QuestionBlock} from "@/entities/module-block/ui/question/QuestionBlock";
import {Check} from "lucide-react";

type Props = {
    id: string,
    content: ChoiceQuestionBlockContent;
    isCompleted : boolean
}


export function ChoiceQuestionBlock({ content, isCompleted, id }: Props) {

    const { variant, correctAnswer} = content;
    console.log(isCompleted);
    const handleToggle = (idx : string, setAnswer : React.Dispatch<React.SetStateAction<string>>) => {
        if (variant === 'Single') setAnswer(idx);
        else setAnswer(prev => prev.includes(idx) ? prev.replaceAll(idx, "") : prev + idx);
    };



    return (
        <QuestionBlock isCompleted={isCompleted} id={id} content={{
            question: content.question,
            description: content.description,
            correctAnswer: content.correctAnswer,
        }}>

            {({ isAnswered,answer, setAnswer }) => ( <div className={styles.quizOptions}>
                {content.options.map((opt, idx) => {

                    const isSelected = variant === 'Single' ? answer === idx.toString() : answer.includes(idx.toString());
                    let statusClass = "";
                    if (isSelected) {
                        statusClass = styles.selected;
                    }
                    return (
                        <div
                            key={idx}
                            className={`${styles.quizOption}  
                            ${statusClass} 
                            ${variant === 'Single' ? `${styles.singleChoice}` : ''}
                            ${isAnswered ? styles.disabled : ""}
                            `}
                            onClick={() => handleToggle(idx.toString(), setAnswer)}
                        >
                            <div className={styles.optionMarker}>
                                {(isSelected) && <Check size={14} className="text-white" />}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: opt }} />
                        </div>
                    );
                })}
            </div>
        )}
        </QuestionBlock>
    )
}