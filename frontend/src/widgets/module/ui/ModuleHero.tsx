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
                  <SteppedProgress total={40} current={12} currentProgress={30}></SteppedProgress>
              </div>
                <div className={styles.category}>
                    Модуль 12 • Математика ЕГЭ
                </div>

                <h1 className={styles.title}>
                    Производная функции и её геометрический смысл
                </h1>

                <div className={styles.meta}>
                    <Clock size={20} />
                    Время на изучение: 15 минут
                </div>

            </div>
        </div>
    )
}