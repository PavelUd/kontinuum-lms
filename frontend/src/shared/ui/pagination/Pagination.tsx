import {Button} from "@/shared/ui/button/Button";

type Props = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
};


export const Pagination = ({ page, totalPages, onChange }: Props) => {
    return (
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
                    onClick={() => onChange(page - 1)}
                >
                    Назад
                </Button>

                {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1;

                    return (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`px-3 py-1 rounded-lg text-sm transition
                ${
                                p === page
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
                    onClick={() => onChange(page + 1)}
                >
                    Вперёд
                </Button>

            </div>
        </div>
    );
};