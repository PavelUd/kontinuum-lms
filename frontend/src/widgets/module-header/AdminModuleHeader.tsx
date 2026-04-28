import Link from "next/link";
import {StatCard} from "@/shared/ui/stat-card/StatCard";

type Props = {
    moduleId: string
}

export function AdminModuleHeader({moduleId}: Props) {
    return (
        <div>
            <nav aria-label="breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-gray-500">

                    <li>
                        <Link href="/admin/courses" className="hover:text-gray-700 transition-colors">Курсы</Link>
                    </li>
                    <li className="text-gray-300">/</li>
                    <li className="font-bold text-gray-600">
                        Статистика: {"Введение в производную"}
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
                    value={`${82}%`}
                />

                <StatCard
                    label="Ср. балл за тест"
                    value={`${4.2} / 5`}
                    valueClassName="text-green-600"
                />
                <StatCard
                    label="Активность"
                    value={`${12} учен.`}
                />
            </div>
        </div>
    )
}