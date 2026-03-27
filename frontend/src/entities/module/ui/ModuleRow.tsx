'use client'

import { ModuleSummary } from '../model/types'
import { ChevronRight, Lock } from 'lucide-react'
import './ModuleRow.css'
import {Status} from "@/entities/course/model/types";

interface Props {
    module: ModuleSummary
    progress?: number
}

export function ModuleRow({ module, progress }: Props) {
    const statusMap: Record<Status, "locked" | "current" | "completed"> = {
        "archived": "locked",
        "active": "current",

    }
    const locked = module.status === "archived"
    let classAttribute =  statusMap[module.status]
    if(module.status == "active" && progress && progress > 79){
        classAttribute = "completed"
    }
    return (
        <div className={`k-module ${classAttribute}`}>

            <div className={`k-module-number ${classAttribute}`}>
                {module.orderIndex}
            </div>

            <div className="k-module-content">

                <div className="k-module-title">
                    {module.title}
                </div>

                {progress && progress > 79 && (
                    <span className="k-module-badge success">
                        Пройдено
                    </span>
                )}

                {module.status === "active" && (!progress || progress < 79) && (
                    <span className="k-module-badge active">
                        Изучаете сейчас
                    </span>
                )}

                {locked && (
                    <span className="k-module-badge locked">
                        <Lock size={14} /> Доступно позже
                    </span>
                )}

            </div>

            {!locked && (
                <ChevronRight
                    size={18}
                    className="k-module-arrow"
                />
            )}

        </div>
    )
}