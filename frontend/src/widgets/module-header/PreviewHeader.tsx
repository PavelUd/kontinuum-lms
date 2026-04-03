import styles from "@/widgets/module-header/header.module.css";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

export function PreviewHeader({courseId} : {courseId : string}) {
    return (
        <header className={styles.lessonHeader}>
            <div className={styles.lessonHeaderContainer}>
                <div className={styles.lessonHeaderInner}>
                    <div className={styles.lessonHeaderLeft}>
                        <Link href={`/admin/courses/${courseId}`}>
                            <button className={styles.backBtn}>
                                <ChevronLeft size={24}/>
                                <span className={styles.btnText}>Назад к курсу</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}