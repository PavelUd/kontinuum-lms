import { LoginForm } from "@/features/auth/ui/LoginForm";
import styles from "@/features/auth/ui/login-page.module.css";

export default function MethodistLoginPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <a className={styles.logo}>Континуум</a>

                <h2 className={styles.title}>Вход</h2>

                <p className={styles.subtitle}>
                    Используйте ваш номер телефона и пароль
                </p>

                <LoginForm />
            </div>
        </div>
    );
}