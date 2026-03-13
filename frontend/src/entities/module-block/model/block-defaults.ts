import {
    BlockType,
    CalloutBlockContent,
    HeadingBlockContent,
    TextBlockContent
} from "@/entities/module-block/model/types";

export type BlockContentMap = {
    text: TextBlockContent,
    heading: HeadingBlockContent,

    image: {
        url: string
        caption: string
    }

    video: {
        url: string
    }

    callout: CalloutBlockContent,


    spoiler: {
        title: string
        content: string
    }

    formula: {
        formula: string
    }

    code: {
        code: string
        language: string
    }
}

export const DEFAULT_BLOCK_CONTENT: BlockContentMap = {

    text: {
        text: "Текст"
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
        title: "",
        content: ""
    },

    formula: {
        formula: ""
    },

    code: {
        code: "",
        language: "javascript"
    }
}

export function getDefaultBlockContent(type: BlockType) {
    // @ts-ignore
    return structuredClone(DEFAULT_BLOCK_CONTENT[type])
}