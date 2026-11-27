'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { AnimatePresence, motion } from "motion/react"
import { CaretDownIcon, SignOutIcon } from "@phosphor-icons/react"
import Avatar from "@/components/Avatar"
import { useGameStore } from "@/store/useGameStore"

export default function UserMenu() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false)
        }

        document.addEventListener("pointerdown", handlePointerDown)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen])

    if (status === "loading") {
        return <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
    }

    if (status !== "authenticated") {
        return (
            <Link
                href="/login"
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-sky-950 shadow-lg transition-colors hover:bg-sky-400"
            >
                Sign in
            </Link>
        )
    }

    const user = session.user

    const handleSignOut = () => {
        setIsOpen(false)
        useGameStore.getState().reset()
        void signOut({ callbackUrl: "/" })
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3 pl-1 transition-colors hover:bg-white/10"
            >
                <Avatar src={user.image} name={user.name} size={32} />
                <span className="hidden max-w-32 truncate text-sm font-bold text-sky-100 sm:block">
                    {user.name || user.email}
                </span>
                <CaretDownIcon
                    size={16}
                    weight="bold"
                    className={`text-sky-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/10 bg-sky-950/90 p-2 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 p-3">
                            <Avatar src={user.image} name={user.name} size={40} />
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate font-bold text-white">{user.name || "Player"}</span>
                                {user.email && (
                                    <span className="truncate text-xs text-sky-300">{user.email}</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleSignOut}
                            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/15"
                        >
                            <SignOutIcon size={20} weight="duotone" />
                            Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}