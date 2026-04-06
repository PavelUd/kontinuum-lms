"use client";

import {Edit3, Eye, Trash2} from "lucide-react";
import {Button} from "@/shared/ui/button/Button";
import {Switch} from "@/shared/ui/switch/Switch";
import {useState} from "react";
import Link from "next/link";
import {Status} from "@/entities/course/model/types";
import {ModuleSummary} from "@/entities/module";
import {useModulesMutations} from "@/entities/module/model/useModulesMutations";
import {LessonAnalyticProgress} from "@/entities/analytic/model/types";

type Props = {
    modules: ModuleSummary[]
    modulesProgress?: LessonAnalyticProgress[]
    onDelete: (id: string, name: string) => void
    courseId: string
}

export function AdminModulesList({modules,onDelete, courseId, modulesProgress}: Props) {

    const query = useModulesMutations(courseId);


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
                    {modules.map((m, idx) => {
                        const progress = modulesProgress?.find(x => x.lessonId == m.id);
                        return (
                        <tr key={m.id ?? ""}>

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
                                    checked={m.status === "active"}
                                    label="Доступен"
                                    onToggle={async (value) => {
                                        const status : Status = value ? "active" : "archived"
                                        await query.setStatus({id : m.id, status})
                                    }}
                                />
                            </td>

                            {/* Метрики */}
                            <td>
                                <div className="flex flex-col text-sm">

                    <span className="font-semibold text-blue-600">
                        {progress ? progress.avgProgress : 0}%{" "}
                        <span className="text-gray-400 font-normal">
                            прогресс
                        </span>
                        </span>
                        <span className="font-semibold text-green-600">
                            {progress ? `${progress.avgScore}` : 0}{" "}
                            <span className="text-gray-400 font-normal">
                                ср. балл
                            </span>
                        </span>
                                </div>
                            </td>

                            {/* Действия */}
                            <td className="text-right pr-4">
                                <div className="flex gap-1 justify-end">

                                    <Link href={`/admin/modules/${m.id}/editor`}>
                                    <Button
                                        variant="ghost"
                                        icon={<Edit3 size={14}/>}>
                                        Правка
                                    </Button>
                                    </Link>
                                    <Link href={`/admin/modules/${m.id}/preview`}>
                                    <Button
                                        variant="ghost"
                                        icon={<Eye size={14}/>}>
                                        Вид
                                    </Button>
                                    </Link>
                                    <Button
                                        variant={"ghost"}
                                        style={{background: "#fef2f2"}}
                                        onClick={() => { onDelete(m.id, m.title)}}
                                        icon={<Trash2 className="text-red-500" size={14}>
                                        </Trash2>}>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
            </div>
        </div>
    )
}