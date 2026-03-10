export type BlockType =
    | "text"
    | "image"
    | "note"
    | "tip"
    | "code"
    | "formula"
    | "video"
    | "spoiler"
    | "page_break"
    | "table"
    | "audio"

export interface ModuleBlock {
    id: string
    type: BlockType
    orderIndex: number
    content : Record<string, any>
}

export type TextBlockContent = {
    title: string
    text: string
}