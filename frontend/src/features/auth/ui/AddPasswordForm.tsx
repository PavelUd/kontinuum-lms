"use client"

import {useState} from "react";
import {AuthInput} from "@/features/auth/ui/AuthInput";
import {AuthButton} from "@/features/auth/ui/AuthButton";
import {useActivateLink} from "@/features/auth/model/useActivateLink";
import {Eye} from "lucide-react";

export function AddPasswordForm({token} :{token : string}) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>("")

    const validatePassword = (value: string) => {
        if (value.length < 6) {
            return "Пароль должен содержать не менее 6 символов"
        }

        if (!/\d/.test(value)) {
            return "Пароль должен содержать хотя бы одну цифру"
        }

        return ""
    }

    const activateMutation = useActivateLink();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validatePassword(password)

        if (validationError) {
            setError(validationError)
            return
        }

        setError("")

        activateMutation.mutate({token, password})
    }

    return (
        <form onSubmit={handleSubmit}>
            <AuthInput
                label=""
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                rightIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <Eye size={22}></Eye>
                    </button>
                }
            />

            {error && (
                <div style={{ color: "red", fontSize: 12 }}>
                    {error}
                </div>
            )}

            {activateMutation.isError && (
                <div style={{color:"red"}}>
                    Ошибка входа
                </div>
            )}

            <AuthButton
                type="submit"
                disabled={activateMutation.isPending}
            >
                {activateMutation.isPending ? "Вход..." : "Установить и Войти"}
            </AuthButton>
        </form>
    )
}