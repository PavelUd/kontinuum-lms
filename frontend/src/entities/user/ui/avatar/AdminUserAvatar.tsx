import styles from "@/entities/user/ui/avatar/user-avatar.module.css";

type Props = {
    name: string

}

export function AdminUserAvatar({ name }: Props) {
    return (
        <div className={styles.adminUserAvatar}>
            {name.slice(0, 2).toUpperCase()}
        </div>
    )
}