export default function ModuleLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    )
}