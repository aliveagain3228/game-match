'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    BookOpenIcon,
    ChatCircleDotsIcon,
    FilmSlateIcon,
    GameControllerIcon,
    PopcornIcon,
    UsersThreeIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import { motion } from "motion/react"
import ContactDrawer from "@/components/ContactDrawer"
import FriendsDrawer from "@/components/FriendsDrawer"
import UserMenu from "@/components/UserMenu"
import { useSocketPresence } from "@/hooks/useSocketPresence"
import { useLeaveGuard } from "@/store/useLeaveGuard"

const HEADERLESS_ROUTES = ["/login", "/register"]

const UPCOMING_SECTIONS: { label: string; Icon: PhosphorIcon }[] = [
    { label: "Movies", Icon: FilmSlateIcon },
    { label: "Cartoons", Icon: PopcornIcon },
    { label: "Books", Icon: BookOpenIcon },
]

const headerButtonClass =
    "flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-bold text-sky-200 transition-colors hover:bg-white/10 hover:text-white"

export default function Header() {
    const pathname = usePathname()
    const { status } = useSession()
    const isAuthenticated = status === "authenticated"

    const [isContactOpen, setIsContactOpen] = useState(false)
    const [isFriendsOpen, setIsFriendsOpen] = useState(false)

    useSocketPresence(isAuthenticated)

    if (HEADERLESS_ROUTES.includes(pathname)) return null

    const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const guard = useLeaveGuard.getState()

        if (guard.isRoomActive) {
            event.preventDefault()
            guard.requestLeave("/")
        }
    }

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 left-0 z-50 grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-white/10 bg-sky-950/70 px-4 backdrop-blur-md sm:px-8"
            >
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        className="flex items-center gap-3 text-xl font-black tracking-tight transition-transform hover:scale-105"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                            <GameControllerIcon size={22} weight="fill" className="text-sky-950" />
                        </div>
                        <span className="hidden text-sky-400 lg:block">
                            Game<span className="text-white">Match</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        aria-label="Contact"
                        onClick={() => setIsContactOpen(true)}
                        className={headerButtonClass}
                    >
                        <ChatCircleDotsIcon size={18} weight="duotone" />
                        <span className="hidden sm:inline">Contact</span>
                    </button>
                </div>

                <nav className="no-scrollbar flex max-w-[45vw] items-center gap-1 overflow-x-auto sm:max-w-none sm:gap-2">
                    <span
                        aria-current="page"
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-extrabold text-sky-950 shadow-lg sm:px-4 sm:py-2 sm:text-sm"
                    >
                        <GameControllerIcon size={18} weight="fill" /> Games
                    </span>
                    {UPCOMING_SECTIONS.map(({ label, Icon }) => (
                        <button
                            key={label}
                            type="button"
                            disabled
                            aria-label={`${label} (coming soon)`}
                            className="flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-sky-300/50 sm:px-4 sm:py-2 sm:text-sm"
                        >
                            <Icon size={18} weight="duotone" />
                            <span className="hidden sm:inline">{label}</span>
                            <span className="hidden rounded bg-sky-950 px-1.5 py-0.5 text-[10px] text-sky-400 sm:inline-block">
                                Soon
                            </span>
                        </button>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-2 sm:gap-3">
                    {isAuthenticated && (
                        <button
                            type="button"
                            aria-label="Friends"
                            onClick={() => setIsFriendsOpen(true)}
                            className={headerButtonClass}
                        >
                            <UsersThreeIcon size={18} weight="duotone" />
                            <span className="hidden sm:inline">Friends</span>
                        </button>
                    )}
                    <UserMenu />
                </div>
            </motion.header>

            <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <FriendsDrawer isOpen={isFriendsOpen} onClose={() => setIsFriendsOpen(false)} />
        </>
    )
}