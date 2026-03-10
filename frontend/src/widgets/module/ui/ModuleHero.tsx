import { Clock } from "lucide-react"
import styles from "./module.module.css"
import {SteppedProgress} from "@/shared/ui/stepped-progress";

type Props = {
    module: number
    category: string
    title: string
    duration: number
    totalSteps: number
    currentStep: number
    progress: number
}

export function ModuleHero({
                               module,
                               category,
                               title,
                               duration,
                               totalSteps,
                               currentStep,
                               progress
                           }: Props) {

    return (
        <div className={styles.hero}>
            <div className={styles.container}>
                <div className={`${styles.progress} step`}>
                  <SteppedProgress total={30} current={12} currentProgress={30}></SteppedProgress>
              </div>
                <div className={styles.category}>
                    Модуль {module} • {category}
                </div>

                <h1 className={styles.title}>
                    {title}
                </h1>

                <div className={styles.meta}>
                    <Clock size={16} />
                    Время на изучение: {duration} минут
                </div>

            </div>
        </div>
    )
}