import {useMutation} from "@tanstack/react-query";
import {activateLink} from "@/features/auth/api/auth.api";
import {saveToken} from "@/shared/lib/auth/tokenStorage";

export function useActivateLink() {
    return useMutation({
        mutationFn: activateLink,
        onSuccess: (data) => {
            saveToken(data.data)
            window.location.href = "/"
        }
    })
}