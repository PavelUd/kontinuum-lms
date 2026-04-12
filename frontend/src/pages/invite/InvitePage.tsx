import styles from "@/features/auth/ui/login-page.module.css";
import {AddPasswordForm} from "@/features/auth/ui/AddPasswordForm";

type Props = {
    token : string
}

export function InvitePage({token} : Props){
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <a className={styles.logo}>Континуум</a>

                <h2 className={styles.title}>Придумайте Пароль</h2>

                <p className={styles.subtitle}>
                    Придумайте пароль (не менее 6 символов)
                    Используйте его для входа в систему
                </p>
                <AddPasswordForm token={token}></AddPasswordForm>
            </div>
        </div>
    )
}