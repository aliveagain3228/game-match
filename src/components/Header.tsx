'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { FaGamepad, FaUser } from "react-icons/fa"
import { Gamepad2, Clapperboard, Popcorn, Book } from "lucide-react"
import { motion } from "framer-motion"
import Avatar from "@/components/Avatar"
import { useGameStore } from "@/store/useGameStore"

const UPCOMING_SECTIONS = [
    { label: "Movies", Icon: Clapperboard },
    { label: "Cartoons", Icon: Popcorn },
    { label: "Books", Icon: Book },
]

export default function Header() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const handleSignOut = () => {
        useGameStore.getState().reset()
        void signOut({ callbackUrl: "/" })
    }

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full h-16 bg-sky-950/80 backdrop-blur-md border-b border-sky-800 z-50 flex items-center justify-between px-4 sm:px-8"
        >
            <Link
                href="/"
                className="flex items-center gap-3 font-black text-xl tracking-tight hover:scale-105 transition-transform"
            >
                <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                    <FaGamepad className="text-sky-950" size={20} />
                </div>
                <span className="text-sky-400 hidden sm:block">Game<span className="text-white">Match</span></span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
                <span
                    aria-current="page"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500 text-sky-950 rounded-full font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 shrink-0"
                >
                    <Gamepad2 size={16} strokeWidth={2.5} /> Games
                </span>
                {UPCOMING_SECTIONS.map(({ label, Icon }) => (
                    <button
                        key={label}
                        type="button"
                        disabled
                        aria-label={`${label} (coming soon)`}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-900/50 text-sky-400/60 rounded-full font-bold text-xs sm:text-sm border border-sky-800/50 cursor-not-allowed flex items-center gap-1.5 shrink-0"
                    >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{label}</span>
                        <span className="hidden sm:inline-block text-[10px] bg-sky-950 px-1.5 py-0.5 rounded text-sky-500">Soon</span>
                    </button>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                {status === "authenticated" ? (
                    <div className="flex items-center gap-3">
                        <Avatar src={session.user.image} name={session.user.name} size={32} />
                        <span className="text-sm font-bold text-sky-200 hidden sm:block">
                            {session.user.name || session.user.email}
                        </span>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        aria-label="Sign in"
                        onClick={() => router.push("/login")}
                        className="w-9 h-9 rounded-full bg-sky-900 border border-sky-700 flex items-center justify-center hover:bg-sky-700 hover:text-white text-sky-400 transition-colors shadow-sm"
                    >
                        <FaUser size={14} />
                    </button>
                )}
            </div>
        </motion.header>
    )
}