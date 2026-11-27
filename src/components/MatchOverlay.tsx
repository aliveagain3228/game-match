'use client'

import { useEffect } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Heart } from "lucide-react"
import type { GameTypes } from "@/types/game"

interface MatchOverlayProps {
    game: GameTypes
    onContinue: () => void
}

const CONFETTI_COLORS = ["#38bdf8", "#7dd3fc", "#fbbf24", "#fb7185", "#ffffff"]
const CONFETTI_DURATION_MS = 1800

export default function MatchOverlay({ game, onContinue }: MatchOverlayProps) {
    useEffect(() => {
        let isActive = true
        let stopConfetti: (() => void) | undefined

        const launchConfetti = async () => {
            const { default: confetti } = await import("canvas-confetti")

            if (!isActive) return

            const endTime = Date.now() + CONFETTI_DURATION_MS

            const frame = () => {
                if (!isActive) return

                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0, y: 0.8 },
                    colors: CONFETTI_COLORS,
                    disableForReducedMotion: true,
                })
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1, y: 0.8 },
                    colors: CONFETTI_COLORS,
                    disableForReducedMotion: true,
                })

                if (Date.now() < endTime) requestAnimationFrame(frame)
            }

            frame()
            stopConfetti = () => confetti.reset()
        }

        void launchConfetti()

        return () => {
            isActive = false
            stopConfetti?.()
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onContinue()
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [onContinue])

    return (
        <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="It's a match"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-sky-950/85 px-4 py-10 text-center backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.6, rotate: -4, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="relative w-full max-w-sm"
            >
                <div className="absolute -top-7 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                    <Heart size={28} fill="currentColor" />
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/20 bg-sky-900 shadow-[0_0_80px_rgba(56,189,248,0.4)]">
                    {game.background_image && (
                        <Image
                            src={game.background_image}
                            alt={game.name}
                            fill
                            sizes="(max-width: 640px) 90vw, 384px"
                            priority
                            className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-sky-950/80 via-transparent to-transparent" />
                </div>
            </motion.div>

            <h1 className="mt-10 bg-linear-to-r from-sky-300 via-white to-amber-300 bg-clip-text text-5xl font-black text-transparent sm:text-6xl">
                It&apos;s a match!
            </h1>
            <p className="mt-3 text-lg font-medium text-sky-200">You both picked</p>
            <h2 className="mt-1 max-w-md text-3xl font-bold text-white">{game.name}</h2>

            <button
                type="button"
                autoFocus
                onClick={onContinue}
                className="mt-10 rounded-full bg-sky-400 px-10 py-4 text-xl font-bold text-sky-950 shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all hover:scale-105 hover:bg-sky-300"
            >
                Keep swiping
            </button>
        </motion.div>
    )
}