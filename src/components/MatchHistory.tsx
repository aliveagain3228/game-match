'use client'

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { GameTypes } from "@/types/game"

interface MatchHistoryProps {
    games: GameTypes[]
    onClose: () => void
}

export default function MatchHistory({ games, onClose }: MatchHistoryProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[60]">
            <button
                type="button"
                aria-label="Close matches"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Our games"
                className="absolute inset-x-0 bottom-0 h-[85dvh] overflow-y-auto rounded-t-3xl border border-white/10 bg-sky-950/90 p-6 shadow-2xl backdrop-blur-xl sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl"
            >
                <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white">All matches</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="text-sky-300 transition-all hover:scale-110 hover:text-white"
                    >
                        <X size={28} />
                    </button>
                </div>

                {games.length === 0 ? (
                    <p className="mt-10 text-center font-medium text-sky-300">
                        You haven&apos;t found any matches yet. Keep swiping!
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {games.map((game) => (
                            <li
                                key={game.id}
                                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
                            >
                                {game.background_image ? (
                                    <Image
                                        src={game.background_image}
                                        alt={game.name}
                                        width={80}
                                        height={80}
                                        className="h-20 w-20 rounded-xl object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-xl bg-sky-800" />
                                )}
                                <p className="text-lg font-bold text-white">{game.name}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}