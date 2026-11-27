'use client'

import { motion, useReducedMotion } from "motion/react"
import { Dice5, Gamepad2, Trophy, type LucideIcon } from "lucide-react"

interface DecorCard {
    Icon: LucideIcon
    rotate: number
    position: string
    duration: number
    tint: string
}

const DECOR_CARDS: DecorCard[] = [
    { Icon: Gamepad2, rotate: -12, position: "left-[7%] top-[24%]", duration: 7, tint: "from-sky-400/30" },
    { Icon: Dice5, rotate: 7, position: "left-[16%] bottom-[10%]", duration: 9, tint: "from-indigo-400/30" },
    { Icon: Trophy, rotate: 13, position: "right-[8%] top-[20%]", duration: 8, tint: "from-amber-300/25" },
    { Icon: Gamepad2, rotate: -6, position: "right-[17%] bottom-[12%]", duration: 10, tint: "from-cyan-300/25" },
]

export default function DecorCards() {
    const shouldReduceMotion = useReducedMotion()

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
            {DECOR_CARDS.map(({ Icon, rotate, position, duration, tint }, index) => (
                <motion.div
                    key={index}
                    style={{ rotate }}
                    animate={shouldReduceMotion ? undefined : { y: [0, -14, 0] }}
                    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute ${position} flex h-60 w-44 flex-col justify-between rounded-3xl border border-white/10 bg-linear-to-br ${tint} to-white/5 p-4 shadow-2xl backdrop-blur-sm`}
                >
                    <Icon size={40} className="text-white/40" />
                    <div className="flex flex-col gap-2">
                        <div className="h-3 w-28 rounded-full bg-white/25" />
                        <div className="h-2 w-20 rounded-full bg-white/15" />
                        <div className="mt-1 flex gap-1.5">
                            <div className="h-4 w-9 rounded-md bg-white/15" />
                            <div className="h-4 w-12 rounded-md bg-white/15" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}