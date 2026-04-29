import {Group} from "@/entities/group/module/types";
import styles from "./group-stats-row.module.css"
import {ChevronDown, ChevronRight, Trash2} from "lucide-react";
import {SteppedProgress} from "@/shared/ui/stepped-progress";
import {Button} from "@/shared/ui/button/Button";
import {GroupAnalyticProgress} from "@/entities/analytic/model/types";

export type Props = {
    group : GroupAnalyticProgress
    onToggle: () => void
    isOpen: boolean
}

export function GroupStatsRow({group, onToggle, isOpen}: Props) {
    return (
        <div key={group.id} className={styles.row}>

            <div className={styles.cell}>
                <div className="flex items-center gap-1">
                    <div className={`
                                flex items-center justify-center w-8 h-8 mr-2 rounded-lg cursor-pointer transition-colors
                                ${isOpen
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-200 text-blue-600"
                                            }
                            `}
                         onClick={onToggle}
                    >
                        {isOpen
                            ? <ChevronDown size={16} />
                            : <ChevronRight size={16} />
                        }
                    </div>
                    <div className="font-semibold text-gray-700">
                        {group.title}
                    </div>
                </div>
            </div>
            <div className={styles.cell}>
                <div className="flex items-center gap-2">
                    <div className="flex-grow-1">
                        <SteppedProgress progress={group.avgProgress} width={225} height={10} />
                    </div>
                    <span className="text-sm font-bold">
                        {group.avgProgress}%
                    </span>
                </div>
            </div>
            <div className={styles.cell}>
            </div>
            <div className={styles.cell}>

            </div>
            <div className={styles.cellRight}>
                <Button
                    variant={"ghost"}
                    onClick={onToggle}
                >
                    <span className={"font-semibold text-xs"}>{isOpen ? "скрыть учеников" : "показать учеников"}</span>
                </Button>
            </div>
        </div>
    )
}