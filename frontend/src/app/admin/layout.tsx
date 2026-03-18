import { RoleGuard } from "@/shared/lib/guards/RoleGuard"
import {AdminSidebar} from "@/features/admin-sidebar/AdminSidebar";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="admin-layout">
            <AdminSidebar></AdminSidebar>
            <main className="main-content">
            {children}
            </main>
        </div>
    )
}