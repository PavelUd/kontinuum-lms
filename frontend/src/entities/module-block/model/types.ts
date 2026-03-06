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

export interface ModuleBlock {
    id: string
    type: BlockType
    orderIndex: number
    data : Record<string, any>
}