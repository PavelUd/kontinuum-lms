import styles from "./admin-course-row.module.css"
import {Layers, Trash2, UserPlus, Users} from "lucide-react";
import {Switch} from "@/shared/ui/switch/Switch";
import {CourseSummary} from "@/entities/course";
import {useCourseStore} from "@/entities/course/model/course.store";
import {CourseStatus} from "@/entities/course/model/types";

export type Props = {
    course : CourseSummary
}

export function AdminCourseRow({course}: Props) {

    const remove = useCourseStore(s => s.removeCourse);
    const updateStatus = useCourseStore(s => s.updateCourseStatus);

    return (
        <div key={course.id} className={styles.courseRow}>
            <div className={styles.courseInfo}>
                <div className={styles.courseTitle}>
                    {course.name}
                </div>

                <div className={styles.courseMeta}>
                        <span className={styles.metaItem}>
                            <Layers size={14} />
                            {course.lessonsCount} модулей
                        </span>

                    <span className={styles.metaItem}>
                            <Users size={14} />
                        12 учеников
                        </span>
                </div>
            </div>

            <div className={styles.switchWrapper}>
                <Switch
                    checked={course.status === "active"}
                    label="Доступен"
                    onToggle={async (value) => {
                        const status : CourseStatus = value ? "active" : "archived"
                        await updateStatus(course.id, status)
                    }}
                />
            </div>

            <div className={styles.progress}>
                <div className={styles.progressLabel}>
                    Средний прогресс
                </div>
                <div className={styles.progressValue}>
                    {12}%
                </div>
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
                    onClick={ () => {remove(course.id)}}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}