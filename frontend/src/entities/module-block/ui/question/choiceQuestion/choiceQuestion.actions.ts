import { ChoiceQuestionVariant } from "../question-content";

export function toggleCorrectAnswer(
    correctAnswer: string,
    optIdx: number,
    variant: ChoiceQuestionVariant
): string {
    const idx = optIdx.toString();

    if (variant === "Single") {
        return correctAnswer.includes(idx) ? "" : idx.toString();
    }

    if (correctAnswer.includes(idx)) {
        return correctAnswer.replaceAll(idx, "");
    }

    return correctAnswer + idx.toString();
}


export function updateOptionText(
    options: string[],
    optIdx: number,
    value: string
): string[] {
    const newOptions = [...options];
    newOptions[optIdx] = value;
    return newOptions;
}


export function removeOption(
    options: string[],
    correctAnswer: string,
    removeIdx: number
): { options: string[]; correctAnswer: string } {

    const newOptions = options.filter((_, i) => i !== removeIdx);

    const newCorrect = correctAnswer.split("")
        .filter(i => Number(i) !== removeIdx)
        .map(i => {
            const num = Number(i);
            return num > removeIdx ? String(num - 1) : i;
        });

    return {
        options: newOptions,
        correctAnswer: newCorrect.join("")
    };
}


export function addOption(options: string[]): string[] {
    if (options.length >= 9) {
        return options;
    }

    return [...options, "Новый вариант ответа"];
}