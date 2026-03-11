import { RoleGuard } from "@/shared/lib/guards/RoleGuard"

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <>{children}</>
    )
}