
import { ComponentType } from "react"
import {BlockType} from "@/entities/module-block/model/types";


export type BlockComponent = ComponentType<any>

const registry = new Map<BlockType, BlockComponent>()



export function registerBlock(type: BlockType, component: BlockComponent) {
    registry.set(type, component)
}

export function getBlock(type: BlockType) {
    return registry.get(type)
}