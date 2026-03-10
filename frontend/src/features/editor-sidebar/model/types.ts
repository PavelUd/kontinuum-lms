import {BlockType} from "@/entities/module-block/model/types";
import {Music,Image,FileMinus, PlayCircle, Type, Table, Info, Lightbulb, EyeOff, Variable, Code, LucideIcon} from "lucide-react";

export type BlockLibraryItem = {
    type: BlockType
    icon: string
    color: string
    label: string
}

export const iconMap: Record<BlockType, LucideIcon> = {
    text: Type,
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

export const defaultBlockContent: Record<BlockType, any> = {
    audio: undefined,
    page_break: undefined,
    table: undefined,
    text: {
        title: "",
        text: ""
    },

    image: {
        url: "",
        caption: ""
    },

    video: {
        url: ""
    },

    note: {
        text: ""
    },

    tip: {
        text: ""
    },

    spoiler: {
        title: "",
        content: ""
    },

    formula: {
        formula: ""
    },

    code: {
        code: "",
        language: "javascript"
    }
}