import {Search} from "lucide-react";

export function EmptyList() {
    return (
        <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Search size={48} className="mb-3 opacity-25 mx-auto" />

            <div className="font-semibold text-lg text-gray-700">
                Ничего не найдено
            </div>

            <div className="text-sm text-gray-400">
                Попробуйте изменить параметры фильтрации
            </div>
        </div>
    )
}