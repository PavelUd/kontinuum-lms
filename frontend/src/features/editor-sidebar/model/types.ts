import {BlockType} from "@/entities/module-block/model/types";
import { CalloutVariant } from "@/entities/module-block/ui/callout/callout-block-content";
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
    Heading,
    FileDown,
    Edit3
} from "lucide-react";

export type BlockLibraryItem = {
    type: BlockType,
    variant?: CalloutVariant
    icon: string
    color: string
    label: string
}

export const iconMap: Record<string, LucideIcon> = {
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
    file : FileDown,
    openquestion: Edit3,

};