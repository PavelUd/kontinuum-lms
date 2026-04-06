import styles from "./admin-course-row.module.css"
import {Layers, Trash2, UserPlus, Users} from "lucide-react";
import {Switch} from "@/shared/ui/switch/Switch";
import {CourseSummary} from "@/entities/course";
import {Status} from "@/entities/course/model/types";
import {plural} from "@/shared/lib/plural/plural";
import {useCourseMutations} from "@/entities/course/model/useCourseMutations";
import {Row} from "@/shared/ui/row/Row";

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
                        1 ученик
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
                <button
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() =>
                        window.dispatchEvent(
                            new CustomEvent("openInvite", { detail: course })
                        )
                    }
                >
                    <UserPlus size={14} />
                    Доступ
                </button>

                <button
                    className={`${styles.button} ${styles.dangerButton}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onDelete()
                    }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </Row>
    )
}