import Link from "next/link"
import type { ReactNode } from "react"

interface AuthShellProps {
    title: string
    subtitle: string
    children: ReactNode
}

export function AuthDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-400 font-semibold text-sm whitespace-nowrap">
                {label}
            </span>
            <div className="flex-1 h-px bg-slate-700"></div>
        </div>
    )
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] p-4 relative overflow-hidden">
            <Link
                href="/"
                className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-violet-500 font-bold bg-[#151C2C] px-4 py-2 rounded-xl shadow-md border border-slate-700 hover:bg-slate-800 transition-all z-10"
            >
                ⬅ Back to Lobby
            </Link>

            <div className="bg-[#151C2C] p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md z-10">
                <h1 className="text-4xl font-black text-white mb-2 text-center">{title}</h1>
                <p className="text-sky-400 text-center mb-8 font-medium">{subtitle}</p>
                {children}
            </div>
        </div>
    )
}