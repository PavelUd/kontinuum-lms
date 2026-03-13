export type BlockType =
    | "text"
    | "heading"
    | "image"
    | "callout"
    | "code"
    | "formula"
    | "video"
    | "spoiler"
    | "page_break"
    | "table"
    | "audio"

export type CalloutVariant = "tip" | "note"

export interface ModuleBlock<T> {
    id: string
    type: BlockType
    orderIndex: number
    content : T
}

export type BlockContent =
    | TextBlockContent
    | CalloutBlockContent
    | HeadingBlockContent

export type EditBlockProps<T = any> = {
    block: ModuleBlock<T>

    isActive: boolean

    setActiveBlock: (id: string | null) => void

    updateBlock: (id: string, patch: Partial<T>) => void
}

export type TextBlockContent = {
    text: string
}

export type HeadingBlockContent = {
    text: string
}
export type CalloutBlockContent = {
    variant: CalloutVariant
    text: string
}

export type CreateBlockProps = {
    content: any,
    type: BlockType,
    orderIndex: number
}

export type UpdateContentBlockProps = {
    content: any,
}

export type MoveBlockProps = {
   aboveBlockId : string | null,
   belowBlockId : string | null
}

export type BlocksState = {
    blockOrder: string[]
    blocksById: Record<string, ModuleBlock<any>>
}

export type BlockCommand =
    | {
    type: "create"
    tempId: string
    lessonId: string
    payload: any
}
    | {
    type: "update"
    id: string
    payload: any
}
    | {
    type: "delete"
    id: string
}
    | {
    type: "reorder"
    id: string,
    payload: {
    aboveBlockId: string | null,
    belowBlockId: string |  null
    }
}
