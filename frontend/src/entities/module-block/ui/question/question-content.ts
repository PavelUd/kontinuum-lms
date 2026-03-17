export type QuestionBlockContent = {
    question : string
    description : string
    correctAnswer : string
}

export type ChoiceQuestionBlockContent = QuestionBlockContent & {
    options: string[]
    variant: ChoiceQuestionVariant
}

export type ChoiceQuestionVariant =  "Single" | "Multiple"
