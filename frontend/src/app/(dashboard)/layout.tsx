import { RoleGuard } from "@/shared/lib/guards/RoleGuard"
import {AdminSidebar} from "@/features/admin-sidebar/AdminSidebar";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <RoleGuard roles={["admin"]}>
                <div className="admin-layout">
                    <AdminSidebar></AdminSidebar>
                    <main className="main-content">
                    {children}
                    </main>
                </div>
        </RoleGuard>
    )
}