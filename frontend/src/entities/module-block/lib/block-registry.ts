
import { ComponentType } from "react"
import {BlockType} from "@/entities/module-block/model/types";


export type BlockComponent = ComponentType<any>

const registry = new Map<BlockType, BlockDefinition>()

type BlockDefinition = {
    view: BlockComponent
    editor?: BlockComponent
}

export function registerBlock(type: BlockType, definition: BlockDefinition) {
    registry.set(type, definition)
}

export function getBlock(
    type: BlockType,
    mode: "view" | "editor" = "view"
) {

    const block = registry.get(type)

    if (!block) return null

    if (mode === "editor") {
        return block.editor ?? block.view
    }

    return block.view
}