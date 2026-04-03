import { Clock } from "lucide-react"
import styles from "./module.module.css"
import {SteppedProgress} from "@/shared/ui/stepped-progress";

type Props = {
    module: number
    category: string
    title: string
}

export function ModuleHero({
                               module,
                               category,
                               title,
                           }: Props) {

    return (
        <div className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.category}>
                    Модуль {module} • {category}
                </div>

                <h1 className={styles.title}>
                    {title}
                </h1>

            </div>
        </div>
    )
}