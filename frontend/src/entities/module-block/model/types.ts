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

export interface ModuleBlock<T> {
    id: string
    type: BlockType
    orderIndex: number
    content : T
    status: string
}

export type EditBlockProps<T = any> = {
    block: ModuleBlock<T>

    isActive: boolean

    setActiveBlock: (id: string | null) => void

    updateBlock: (id: string, patch: Partial<T>) => void
}

export type TextBlockContent = {
    title: string
    text: string
}

export type BlocksState = {
    blockOrder: string[]
    blocksById: Record<string, ModuleBlock<any>>
}

export type BlockStatus = "saving" | "saved" | "error"
