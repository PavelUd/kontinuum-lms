import styles from "./admin-course-row.module.css"
import {Layers, Trash2, UserPlus, Users} from "lucide-react";
import {Switch} from "@/shared/ui/switch/Switch";

export type Props = {
    course : any
}

export function AdminCourseRow({course}: Props) {
    return (
        <div key={course.id} className={styles.courseRow}>
            <div className={styles.courseInfo}>
                <div className={styles.courseTitle}>
                    {course.title}
                </div>

                <div className={styles.courseMeta}>
                        <span className={styles.metaItem}>
                            <Layers size={14} />
                            {course.modulesCount} модулей
                        </span>

                    <span className={styles.metaItem}>
                            <Users size={14} />
                        {course.students} учеников
                        </span>
                </div>
            </div>

            <div className={styles.switchWrapper}>
                <Switch
                    checked={course.status === "active"}
                    label="Доступен"
                    onToggle={(value) => {
                        console.log("toggle:", value);
                    }}
                />
            </div>

            <div className={styles.progress}>
                <div className={styles.progressLabel}>
                    Средний прогресс
                </div>
                <div className={styles.progressValue}>
                    {course.avgProgress}%
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
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}