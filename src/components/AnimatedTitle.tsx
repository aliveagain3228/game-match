'use client'

import { motion, useReducedMotion } from "motion/react"

interface AnimatedTitleProps {
    first: string
    second: string
}

const LETTER_DELAY = 0.06

export default function AnimatedTitle({ first, second }: AnimatedTitleProps) {
    const shouldReduceMotion = useReducedMotion()
    const letters = [
        ...first.split("").map((char) => ({ char, className: "text-sky-400" })),
        ...second.split("").map((char) => ({ char, className: "text-white" })),
    ]

    return (
        <h1
            aria-label={`${first}${second}`}
            className="relative mb-10 flex justify-center text-5xl font-black drop-shadow-lg sm:text-6xl"
        >
            {letters.map(({ char, className }, index) => (
                <motion.span
                    key={index}
                    aria-hidden="true"
                    initial={shouldReduceMotion ? false : { y: 0 }}
                    animate={shouldReduceMotion ? undefined : { y: [0, -28, 0, -8, 0] }}
                    whileHover={shouldReduceMotion ? undefined : { y: -14, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.7, delay: 0.5 + index * LETTER_DELAY, ease: "easeOut" }}
                    className={`inline-block ${className}`}
                >
                    {char}
                </motion.span>
            ))}
        </h1>
    )
}