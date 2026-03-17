import {ChoiceQuestionBlockContent} from "@/entities/module-block/ui/question/question-content";
import styles from "@/entities/module-block/ui/question/question.module.css";
import {QuestionBlock} from "@/entities/module-block/ui/question/QuestionBlock";
import {Check} from "lucide-react";
import {useState} from "react";

type Props = {
    content: ChoiceQuestionBlockContent;
}


export function ChoiceQuestionBlock({ content }: Props) {

    const [selected, setSelected] = useState("");
    const { variant, correctAnswer} = content;

    const handleToggle = (idx : string) => {
        if (variant === 'Single') setSelected(idx);
        else setSelected(prev => prev.includes(idx) ? prev.replaceAll(idx, "") : prev + idx);
    };



    return (
        <QuestionBlock content={{
            question: content.question,
            description: content.description,
            correctAnswer: content.correctAnswer,
        }}>

            <div className={styles.quizOptions}>
                {content.options.map((opt, idx) => {

                    const isSelected = variant === 'Single' ? selected === idx.toString() : selected.includes(idx.toString());
                    let statusClass = "";
                    if (isSelected) {
                        statusClass = styles.selected;
                    }
                    return (
                        <div
                            key={idx}
                            className={`${styles.quizOption}  ${statusClass} ${variant === 'Single' ? `${styles.singleChoice}` : ''}`}
                            onClick={() => handleToggle(idx.toString())}
                        >
                            <div className={styles.optionMarker}>
                                {(isSelected) && <Check size={14} className="text-white" />}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: opt }} />
                        </div>
                    );
                })}
            </div>
        </QuestionBlock>
    )
}