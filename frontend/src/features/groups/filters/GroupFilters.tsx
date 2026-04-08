import {X} from "lucide-react";
import {useEmployeesLookupQuery} from "@/entities/user/models/useEmployeesQuery";
import {useCoursesLookupQuery} from "@/entities/course/model/useCoursesQuery";

type Props = {
    courseId: string
    teacherId: string
    onCourseChange: (v: string) => void
    onTeacherChange: (v: string) => void
    onReset: () => void
}

export function GroupFilters({
                                 courseId,
                                 teacherId,
                                 onCourseChange,
                                 onTeacherChange,
                                 onReset
                             }: Props){

    const {isLoading, data} = useEmployeesLookupQuery();
    const {data: coursesData,isLoading: isCoursesLoading} = useCoursesLookupQuery();
    return (
        <div className="bg-gray-50/50 shadow-sm rounded-2xl p-4 mb-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end ">

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Фильтр по курсу
                    </label>

                    <select
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        value={courseId}
                        onChange={e => onCourseChange(e.target.value)}
                    >
                        <option value="">Все курсы</option>

                        {coursesData?.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}

                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Преподаватель
                    </label>

                    <select
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        value={teacherId}
                        onChange={e => onTeacherChange(e.target.value)}
                    >
                        <option value="">Все преподаватели</option>

                        {data?.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.fullname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end">
                    {(
                        <button
                            onClick={onReset}
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