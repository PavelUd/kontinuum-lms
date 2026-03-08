import { LoginForm } from "@/features/auth/ui/LoginForm";
import styles from "@/features/auth/ui/login-page.module.css";

export default function MethodistLoginPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <a className={styles.logo}>Континуум</a>

                <h2 className={styles.title}>Вход для методистов</h2>

                <p className={styles.subtitle}>
                    Используйте ваш номер телефона и пароль для доступа к панели управления
                </p>

                <LoginForm />

                <div className={styles.bottom}>
                    <a href="/login" className={styles.studentLink}>
                        Я ученик, хочу войти в кабинет
                    </a>
                </div>
            </div>
        </div>
    );
}