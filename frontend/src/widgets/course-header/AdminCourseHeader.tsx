import Link from "next/link";
import {Button} from "@/shared/ui/button/Button";
import {Plus} from "lucide-react";
import {StatCard} from "@/shared/ui/stat-card/StatCard";

type Props = {
    title: string,
    students: number,
    avgProgress : number,
    avgScore : number
    onCreate: () => void
}

export function AdminCourseHeader({onCreate, title, students, avgScore, avgProgress}: Props) {
    return (
        <div>
            <nav aria-label="breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-gray-500">

                    <li>
                        <Link href="/admin/courses" className="hover:text-gray-700 transition-colors">Курсы</Link>
                    </li>
                    <li className="text-gray-300">/</li>
                    <li className="font-bold text-gray-600">
                        {title}
                    </li>
                </ol>
            </nav>

            <div className="flex items-center justify-between mb-14">

                <div>
                    <h2 className="text-3xl  font-semibold m-0 ">{title}</h2>
                    <p className="text-gray-500 mt-2">Управление составом курса и просмотр аналитики</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={onCreate}
                        variant="primary"
                        icon={<Plus size={18} />}>
                        Добавить модуль
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 mb-8 text-center md:grid-cols-3">

                <StatCard
                    label="Всего учеников"
                    value={students}
                />

                <StatCard
                    label="Средний прогресс"
                    value={`${avgProgress}%`}
                />

                <StatCard
                    label="Средний балл"
                    value={`${avgScore} / 5`}
                    valueClassName="text-green-600"
                />

            </div>
        </div>
    )
}