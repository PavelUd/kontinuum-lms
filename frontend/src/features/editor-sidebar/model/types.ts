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
    Edit3, CircleDot, CheckSquare
} from "lucide-react";
import {ChoiceQuestionVariant} from "@/entities/module-block/ui/question/question-content";

export type BlockLibraryItem = {
    type: BlockType,
    variant?: CalloutVariant | ChoiceQuestionVariant
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
    file : FileDown,
    openquestion: Edit3,
    pagebreak: FileMinus,
    Single: CircleDot,
    Multiple: CheckSquare
};