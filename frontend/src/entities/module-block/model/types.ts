import {TextBlockContent} from "@/entities/module-block/ui/text/text-block-content";
import {CalloutBlockContent} from "@/entities/module-block/ui/callout/callout-block-content";
import {HeadingBlockContent} from "@/entities/module-block/ui/heading/heading-block-content";

export type BlockType =
    | "text"
    | "heading"
    | "image"
    | "callout"
    | "code"
    | "formula"
    | "video"
    | "spoiler"
    | "table"
    | "audio"
    | "file"
    | "openquestion"
    | "choicequestion"
    | "pagebreak"

export interface ModuleBlock<T> {
    id: string
    type: BlockType
    orderIndex: number
    content : T
}

export type uploadFileResult = {
    key: string,
    uploadUrl: string,
    fileUrl : string
}

export type UploadType =
    | "image"
    | "video"
    | "audio"
    | "file"


export type FileBlockContent = {
    url?: string
    caption?: string
}

export type uploadFileRequest = {
    fileName: string,
    contentType: string,
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

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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

export type AnswerQuestionRequest ={
    payload : {
        answer: string
    }
}

export type AnswerQuestionResponse ={
    isCompleted: true
}
