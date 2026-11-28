'use client'

import { motion, useReducedMotion } from "motion/react"
import { GameControllerIcon } from "@phosphor-icons/react"

interface GameLoaderProps {
    label?: string
    fullscreen?: boolean
}

export default function GameLoader({ label = "Loading", fullscreen = false }: GameLoaderProps) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex flex-col items-center justify-center gap-5 ${fullscreen ? "min-h-screen" : "py-10"}`}
        >
            <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-xl" />
                <motion.div
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
                    className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-sky-400 to-sky-600 text-sky-950 shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                >
                    <GameControllerIcon size={44} weight="fill" />
                </motion.div>
            </div>

            <p className="flex items-end text-lg font-black tracking-widest text-sky-200 uppercase">
                {label}
                {[0, 1, 2].map((index) => (
                    <motion.span
                        key={index}
                        animate={shouldReduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.2 }}
                    >
                        .
                    </motion.span>
                ))}
            </p>
        </div>
    )
}