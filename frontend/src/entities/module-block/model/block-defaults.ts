import { BlockType } from "@/entities/module-block/model/types";
import {CalloutBlockContent} from "@/entities/module-block/ui/callout/callout-block-content";
import {HeadingBlockContent} from "@/entities/module-block/ui/heading/heading-block-content";
import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";
import {FormulaBlockContent} from "@/entities/module-block/ui/formula/formula-block-content";
import {SpoilerBlockContent} from "@/entities/module-block/ui/spoiler/spoiler-block-content";
import {TableBlockContent} from "@/entities/module-block/ui/table/table-block-content";
import {CodeBlockContent} from "@/entities/module-block/ui/code/code-block-content";

export type BlockContentMap = {
    text: TextBlockContent,
    heading: HeadingBlockContent,
    callout: CalloutBlockContent,
    spoiler: SpoilerBlockContent,
    formula: FormulaBlockContent,
    table: TableBlockContent,
    code: CodeBlockContent,
    image: {
        url: string
        caption: string
    }

    video: {
        url: string
    }
}

export const DEFAULT_BLOCK_CONTENT: BlockContentMap = {

    text: {
        text: "Текст"
    },
    table: {
        columns: [{id: "c1",title: "Загаловок 1"},{id: "c2",title: "Загаловок 2"}],
        rows: [{id:"r1", cells:["Строка 1", "Строка 2"]}]
    },
    heading: {
        text: "Заголовок"
    },

    image: {
        url: "",
        caption: ""
    },

    video: {
        url: ""
    },

    callout: {
        variant: "note",
        text: "Содержимое..."
    },

    spoiler: {
        title: "Показать подсказку",
        text: "Здесь находится скрытый контент или ответ на вопрос."
    },

    formula: {
        formula: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}"
    },

    code: {
        code: "print('hello world')",
        language: "python"
    }
}

export function getDefaultBlockContent(type: BlockType) {
    // @ts-ignore
    return structuredClone(DEFAULT_BLOCK_CONTENT[type])
}