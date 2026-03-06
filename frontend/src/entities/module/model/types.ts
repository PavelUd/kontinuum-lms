import {ModuleBlock} from "@/entities/module-block/model/types";

export interface ModuleSummary {
    id: string
    title: string;
    status: number | string;
    orderIndex: number;
}

export interface Module {
    id: string
    title: string;
    status: number;
    orderIndex: number;
    blocks: ModuleBlock[]
}