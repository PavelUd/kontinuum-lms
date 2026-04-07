import {X} from "lucide-react";

export function GroupFilters(){
    return (
        <div className="bg-gray-50/50 shadow-sm rounded-2xl p-4 mb-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end ">

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Фильтр по курсу
                    </label>

                    <select
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        value={""}
                        onChange={e => {}}
                    >
                        <option value="all">Все курсы</option>

                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Преподаватель
                    </label>

                    <select
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        value={"hello"}
                        onChange={e => {}}
                    >
                        <option value="all">Все преподаватели</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    {(
                        <button
                            className="flex items-center gap-1 font-semibold text-blue-500 hover:text-primary transition"
                        >
                            <X size={14} />
                            Сбросить фильтры
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}