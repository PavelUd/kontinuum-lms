import {BlockType} from "@/entities/module-block/model/types";

export type BlockContentMap = {
    text: {
        title: string
        text: string
    }

    image: {
        url: string
        caption: string
    }

    video: {
        url: string
    }

    note: {
        text: string
    }

    tip: {
        text: string
    }

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
        title: "hello",
        text: "hello"
    },

    image: {
        url: "",
        caption: ""
    },

    video: {
        url: ""
    },

    note: {
        text: ""
    },

    tip: {
        text: ""
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