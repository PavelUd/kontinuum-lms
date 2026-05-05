import { useEffect, useState } from "react"
import { RefreshCw, CheckCircle, AlertCircle, LucideIcon } from "lucide-react"
import styles from "./save-status-indicator.module.css"
import { SaveStatus } from "@/entities/module-block/model/types"

type Props = {
    status: SaveStatus
}

const configs: Record<Exclude<SaveStatus, 'idle'>, {
    text: string
    icon: LucideIcon
    className: string
}> = {
    saving: {
        text: 'Сохранение...',
        icon: RefreshCw,
        className: styles.statusSaving
    },
    saved: {
        text: 'Сохранено',
        icon: CheckCircle,
        className: styles.statusSaved
    },
    error: {
        text: 'Ошибка сохранения',
        icon: AlertCircle,
        className: styles.statusError
    }
}

export function SaveStatusIndicator({ status }: Props) {

    const [visibleStatus, setVisibleStatus] = useState<SaveStatus>('idle')

    useEffect(() => {
        if (status === 'saved') {
            setVisibleStatus('saved')

            const t = setTimeout(() => {
                setVisibleStatus('idle')
            }, 1500)

            return () => clearTimeout(t)
        }

        if (status === 'idle') {
            setVisibleStatus('idle')
            return
        }

        setVisibleStatus(status)
    }, [status])

    if (visibleStatus === 'idle') return null

    const config = configs[visibleStatus]
    const IconComponent = config.icon

    return (
        <div className={`${styles.saveStatus} ${config.className}`}>
            <IconComponent
                size={16}
                className={visibleStatus === 'saving' ? styles.spinnerAnimate : ''}
            />
            <span>{config.text}</span>
        </div>
    )
}