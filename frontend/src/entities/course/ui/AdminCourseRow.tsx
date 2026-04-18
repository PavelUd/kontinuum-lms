import styles from "./admin-course-row.module.css"
import {Edit2, Layers, Trash2, UserPlus, Users} from "lucide-react";
import {Switch} from "@/shared/ui/switch/Switch";
import {CourseSummary} from "@/entities/course";
import {Status} from "@/entities/course/model/types";
import {plural} from "@/shared/lib/plural/plural";
import {useCourseMutations} from "@/entities/course/model/useCourseMutations";
import {Row} from "@/shared/ui/row/Row";
import {Button} from "@/shared/ui/button/Button";

export type Props = {
    course : CourseSummary
    onDelete: () => void
}

export function AdminCourseRow({course, onDelete}: Props) {

    const mutations = useCourseMutations();

    return (
        <Row key={course.id}>
            <div className={styles.courseInfo}>
                <div className={styles.courseTitle}>
                    {course.name}
                </div>

                <div className={styles.courseMeta}>
                        <span className={styles.metaItem}>
                            <Layers size={14} />
                            {course.lessonsCount}{" "}
                            {plural(course.lessonsCount, "модуль", "модуля", "модулей")}
                        </span>

                    <span className={styles.metaItem}>
                            <Users size={14} />
                        {course.lessonsCount == 1 ? course.lessonsCount : course.lessonsCount * 2} {plural(course.lessonsCount, "ученик", "ученика", "учеников")}
                        </span>
                </div>
            </div>

            <div className={styles.switchWrapper} onClick={(e) => e.stopPropagation()}>
                <Switch
                    checked={course.status === "active"}
                    label="Доступен"
                    onToggle={async (value) => {
                        const status : Status = value ? "active" : "archived"
                        await mutations.setStatus({id: course.id,status: status})
                    }}
                />
            </div>

            <div className={styles.actions}>
                <Button
                    variant="ghost"
                    icon={<Edit2 size={14}/>}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }}
                >
                </Button>

                <Button
                    variant={"ghost"}
                    style={{background: "#fef2f2"}}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete()
                    }}
                    icon={<Trash2 className="text-red-500" size={14}>
                    </Trash2>}>
                </Button>
            </div>
        </Row>
    )
}