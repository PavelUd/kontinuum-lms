import { useMutation } from "@tanstack/react-query"
import { saveToken } from "@/shared/api/auth/tokenStorage"
import {login} from "@/features/auth/api/login.api";

export function useLogin() {

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            saveToken(data.data)
            window.location.href = "/"
        }
    })
}