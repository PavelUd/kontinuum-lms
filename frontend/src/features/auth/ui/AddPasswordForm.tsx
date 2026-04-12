"use client"

import {useState} from "react";
import {AuthInput} from "@/features/auth/ui/AuthInput";
import {AuthButton} from "@/features/auth/ui/AuthButton";
import {useLogin} from "@/features/auth/model/useLogin";

export function AddPasswordForm() {
    const [password, setPassword] = useState("");

    const loginMutation = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            <AuthInput
                type={"text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loginMutation.isPending ? "Вход..." : "Установить и Войти"}
            </AuthButton>
        </form>
    )
}