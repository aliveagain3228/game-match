'use client'

import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ExternalLink, X } from "lucide-react"
import { CONTACTS } from "@/lib/contacts"

interface ContactDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="contact-drawer"
                    className="fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        type="button"
                        aria-label="Close contacts"
                        onClick={onClose}
                        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
                    />

                    <motion.aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="Contact"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                        className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col overflow-y-auto border-r border-white/10 bg-sky-950/90 p-6 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-3xl font-black text-white">Contact</h2>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={onClose}
                                className="text-sky-300 transition-all hover:scale-110 hover:text-white"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <p className="mb-6 text-sm font-medium text-sky-300">
                            Found a bug or have an idea for GameMatch? Write to me:
                        </p>

                        <ul className="flex flex-col gap-3">
                            {CONTACTS.map(({ id, label, handle, href, Icon, accent }) => {
                                const isExternal = href.startsWith("https://")

                                return (
                                    <li key={id}>
                                        <a
                                            href={href}
                                            target={isExternal ? "_blank" : undefined}
                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:border-sky-400/40 hover:bg-white/10"
                                        >
                                            <span
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg ${accent}`}
                                            >
                                                <Icon size={22} />
                                            </span>
                                            <span className="flex min-w-0 flex-1 flex-col">
                                                <span className="font-bold text-white">{label}</span>
                                                <span className="truncate text-sm text-sky-300">{handle}</span>
                                            </span>
                                            <ExternalLink
                                                size={16}
                                                className="text-sky-400 opacity-0 transition-opacity group-hover:opacity-100"
                                            />
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    )
}