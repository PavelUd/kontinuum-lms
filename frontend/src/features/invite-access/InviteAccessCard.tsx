import { Link } from "lucide-react"
import styles from "./InviteAccess.module.css"
import {useState} from "react";

type Props = {
    inviteLink : string
}

export function InviteAccessCard({ inviteLink }: Props) {

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!inviteLink) return
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        const fullLink = `${window.location.origin}/invite/activate/${inviteLink}`

        await navigator.clipboard.writeText(fullLink)
    }

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>
                Приглашение в систему
            </label>

            <div className={styles.card}>
                <div className={styles.left}>
                    <div className={styles.iconWrapper}>
                        <Link size={16} className="text-gray-600" />
                    </div>

                    <div>
                        <div className={styles.title}>
                            Ссылка для регистрации
                        </div>

                        <div className={styles.subtitle}>
                            Позволяет получить доступ к системе
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.button} ${
                        copied ? styles.success : styles.outline
                    }`}
                    onClick={handleCopy}
                >
                    {copied ? "Скопировано!" : "Копировать"}
                </button>
            </div>
        </div>
    )
}