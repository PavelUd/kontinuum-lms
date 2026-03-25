export type CompleteBlockPayload = {
    duration?: number
}

export type CompleteBlockItem = {
    blockId: string
    payload: CompleteBlockPayload
}

export type CompleteBlocksRequest = {
    blocks: CompleteBlockItem[]
}