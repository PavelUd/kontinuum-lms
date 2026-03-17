export type QuestionBlockContent = {
    question : string
    description : string
    correctAnswer : string
}

export type ChoiceQuestionBlockContent = QuestionBlockContent & {
    options: string[]
}