"use client";

import {BarChart2, Edit3, Eye} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import {Switch} from "@/shared/ui/switch/Switch";
import {useState} from "react";

type Props = {
    modules: any[]
}

export function AdminModulesList({modules}: Props) {

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const totalPages = Math.ceil(modules.length / pageSize);

    const paginatedModules = modules.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <div>
            <div className="table-wrapper">
                <table className="base-dashboard-table">
                    <thead>
                    <tr>
                        <th className="pl-4">#</th>
                        <th>Модуль</th>
                        <th>Статус</th>
                        <th>Метрики</th>
                        <th className="text-right pr-4">Действия</th>
                    </tr>
                    </thead>

                    <tbody>
                    {modules.map((m, idx) => (
                        <tr key={m.id}>

                            {/* № */}
                            <td className="pl-4 text-gray-400 text-sm font-semibold">
                                №{idx + 1}
                            </td>

                            {/* Модуль */}
                            <td>
                                <div className="font-semibold">
                                    {m.title}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {idx === 3 ? 'Тест' : 'Теория'}
                                </div>
                            </td>

                            {/* Статус */}
                            <td>
                                <Switch
                                    checked={m.available}
                                    label="Доступен"
                                    onToggle={(value) => console.log("toggle:", value)}
                                />
                            </td>

                            {/* Метрики */}
                            <td>
                                <div className="flex flex-col text-sm">

                    <span className="font-semibold text-blue-600">
                        {m.progress}%{" "}
                        <span className="text-gray-400 font-normal">
                            прогресс
                        </span>
                    </span>
                                    <span className="font-semibold text-green-600">
                        {m.avgScore}{" "}
                                        <span className="text-gray-400 font-normal">
                            ср. балл
                        </span>
                    </span>
                                </div>
                            </td>

                            {/* Действия */}
                            <td className="text-right pr-4">
                                <div className="flex gap-1 justify-end">

                                    <Button
                                        variant="ghost"
                                        icon={<BarChart2 size={14}/>}>Статистика
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        icon={<Edit3 size={14}/>}>
                                        Правка
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        icon={<Eye size={14}/>}>
                                        Вид
                                    </Button>

                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-2">

                {/* Информация */}
                <div className="text-sm text-gray-500">
                    Страница {page} из {totalPages}
                </div>

                {/* Кнопки */}
                <div className="flex gap-2">

                    <Button
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Назад
                    </Button>

                    {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;

                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 rounded-lg text-sm transition
                        ${p === page
                                    ? "bg-slate-900 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}

                    <Button
                        variant="ghost"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Вперёд
                    </Button>

                </div>
            </div>
        </div>
    )
}