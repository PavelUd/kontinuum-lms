"use client";

import { useState } from "react";
import {formatPhone} from "@/features/auth/ui/formatPhone";
import {AuthInput} from "@/features/auth/ui/AuthInput";
import {AuthButton} from "@/features/auth/ui/AuthButton";
import {Eye} from "lucide-react";
import {useLogin} from "@/features/auth/model/useLogin";


export function LoginForm() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);



    const handlePhoneChange = (value: string) => {
        setPhone(value);
    };

    const loginMutation = useLogin()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        loginMutation.mutate({
            login: phone,
            password: password
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <AuthInput
                label="Номер телефона"
                value={phone}
                placeholder="+7 (999) 000-00-00"
                onChange={(e) => handlePhoneChange(e.target.value)}
            />

            <AuthInput
                label="Пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                rightIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <Eye size={22}></Eye>
                    </button>
                }
            />

            {loginMutation.isError && (
                <div style={{color:"red"}}>
                    Ошибка входа
                </div>
            )}

            <AuthButton
                type="submit"
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending ? "Вход..." : "Войти"}
            </AuthButton>
        </form>
    );
}