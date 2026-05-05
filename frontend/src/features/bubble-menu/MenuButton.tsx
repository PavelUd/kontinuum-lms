export function MenuButton({
                        children,
                        active,
                        onClick,
                    }: {
    children: React.ReactNode
    active?: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // 🔥 важно: не теряет выделение
            onClick={onClick}
            className={`
        flex items-center justify-center
        h-8 w-8
        rounded-md
        transition-all duration-150

        ${active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
      `}
        >
            {children}
        </button>
    )
}