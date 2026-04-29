"use client"

import Link from "next/link";
import {StatCard} from "@/shared/ui/stat-card/StatCard";
import {ModuleSummary} from "@/entities/module";
import { UseModuleProgressAnalyticQuery } from "@/entities/analytic/model/UseModuleProgressAnalyticQuery";

type Props = {
    module?: ModuleSummary
}

export function AdminModuleHeader({module}: Props) {

    const {data, isLoading} = UseModuleProgressAnalyticQuery(module?.courseId ?? "", module?.id ?? "");

    return (
        <div>
            <nav aria-label="breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-gray-500">

                    <li>
                        <Link href="/admin/courses" className="hover:text-gray-700 transition-colors">Курсы</Link>
                    </li>
                    <li className="text-gray-300">/</li>
                    <li className="font-bold text-gray-600">
                        Статистика: {module?.title}
                    </li>
                </ol>
            </nav>

            <div className="flex items-center justify-between mb-14">
                <div>
                    <h2 className="text-3xl  font-semibold m-0 ">Статистика обучения</h2>
                </div>
            </div>

            <div className="grid gap-4 mb-8 text-center md:grid-cols-3">

                <StatCard
                    label="Процент прохождения"
                    value={`${data?.avgProgress}%`}
                    isLoading={isLoading}
                />

                <StatCard
                    label="Ср. балл за тест"
                    value={`${data?.avgScore} / 5`}
                    valueClassName="text-green-600"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Активность"
                    value={`${data?.studentsCount} учен.`}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}