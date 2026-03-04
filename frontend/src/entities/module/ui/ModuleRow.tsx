'use client'

import { ModuleSummary } from '../model/types'
import { ChevronRight, Lock } from 'lucide-react'
import './ModuleRow.css'

interface Props {
    module: ModuleSummary
}

export function ModuleRow({ module }: Props) {

    const locked = module.status === 1

    return (
        <div className={`k-module completed`}>

            <div className="k-module-number">
                {module.orderIndex}
            </div>

            <div className="k-module-content">

                <div className="k-module-title">
                    {module.title}
                </div>

                {module.status === 0 && (
                    <span className="k-module-badge success">
                        Пройдено
                    </span>
                )}

                {module.status === 2 && (
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
                    size={24}
                    className="k-module-arrow"
                />
            )}

        </div>
    )
}