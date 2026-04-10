import {Search, X} from "lucide-react";
import styles from "./student-filters.module.css"
import {Input} from "@/shared/ui/input/Input";
import { useState } from "react";
import {Select} from "@/shared/ui/input/Select";

export function StudentFilters(){

    const [studentSearch, setStudentSearch] = useState('')
    const [filterGrade, setFilterGrade] = useState('');
    const [filterCoursesCount, setFilterCoursesCount] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    return (
        <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">

                {/* SEARCH */}
                <div className="md:col-span-4">
                    <div className={styles.searchWrapper}>
                        <Search size={14} className={styles.searchIcon} />
                        <input
                            type="text"
                            className={`${styles.searchInput}`}
                            placeholder="Поиск ученика..."
                            value={studentSearch}
                            onChange={e => setStudentSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* GRADE */}
                <div className="md:col-span-2">
                    <select
                        className={styles.formSelect}
                        value={filterGrade}
                        onChange={e => setFilterGrade(e.target.value)}
                    >
                    <option value="">Класс: Все</option>
                    <option value="9">9 класс</option>
                    <option value="10">10 класс</option>
                    <option value="11">11 класс</option>
                    </select>
                </div>

                {/* COURSES COUNT */}
                <div className="md:col-span-2">
                    <select
                        className={styles.formSelect}
                        value={filterCoursesCount}
                        onChange={e => setFilterCoursesCount(e.target.value)}
                    >
                        <option value="">Курсов: Все</option>
                        <option value="1">1 курс</option>
                        <option value="2">2+ курса</option>
                        <option value="3">3+ курса</option>
                    </select>
                </div>

                {/* STATUS */}
                <div className="md:col-span-2">
                    <select
                        className={styles.formSelect}
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="">Статус: Все</option>
                        <option value="active">Активен</option>
                        <option value="draft">Пауза</option>
                    </select>
                </div>

                {/* RESET */}
                <div className="md:col-span-2 flex justify-start md:justify-end">
                    {(
                        <button
                            onClick={() => {
                                setStudentSearch('');
                                setFilterGrade('');
                                setFilterCoursesCount('all');
                                setFilterStatus('');
                            }}
                            className="flex items-center gap-1 text font-semibold text-blue-500 hover:text-primary transition"
                        >
                            Сбросить
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}