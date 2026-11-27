'use client'

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"

interface AmbientCoverProps {
    src: string | null
}

export default function AmbientCover({ src }: AmbientCoverProps) {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <AnimatePresence>
                {src && (
                    <motion.div
                        key={src}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Image
                            src={src}
                            alt=""
                            fill
                            sizes="96px"
                            quality={40}
                            className="scale-125 object-cover opacity-50 blur-3xl saturate-150"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-linear-to-b from-sky-950/50 via-sky-950/40 to-sky-950/90" />
        </div>
    )
}