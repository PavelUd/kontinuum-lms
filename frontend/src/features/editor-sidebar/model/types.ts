import {BlockType} from "@/entities/module-block/model/types";
import {
    Music,
    Image,
    FileMinus,
    PlayCircle,
    Type,
    Table,
    Info,
    Lightbulb,
    EyeOff,
    Variable,
    Code,
    LucideIcon,
    Heading
} from "lucide-react";

export type BlockLibraryItem = {
    type: BlockType
    icon: string
    color: string
    label: string
}

export const iconMap: Record<BlockType, LucideIcon> = {
    text: Type,
    heading: Heading,
    image: Image,
    video: PlayCircle,
    audio: Music,
    table: Table,
    note: Info,
    tip: Lightbulb,
    spoiler: EyeOff,
    formula: Variable,
    code: Code,
    page_break: FileMinus,
};