import Image from "next/image"
import { motion, useMotionValue, useTransform, type Variants } from "motion/react"
import { Heart, Undo2, X } from "lucide-react"
import type { GameTypes } from "@/types/game"

interface GameCardProps {
    game: GameTypes
    onLike: () => void
    onDislike: () => void
    onUndo: () => void
}

const cardVariants: Variants = {
    enter: { opacity: 0, scale: 0.9, y: 100 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: (direction: number) => ({
        x: direction * 500,
        y: direction === 0 ? 200 : 0,
        opacity: 0,
        transition: { duration: 0.2 },
    }),
}

const ratingClass = (rating: number) => {
    if (rating >= 4) return "bg-emerald-500/90 text-emerald-950"
    if (rating >= 3) return "bg-amber-400/90 text-amber-950"
    return "bg-rose-500/90 text-white"
}

export default function GameCard({ game, onLike, onDislike, onUndo }: GameCardProps) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-18, 18])
    const overlayOpacity = useTransform(x, [-150, 0, 150], [0.5, 0, 0.5])
    const overlayColor = useTransform(x, [-150, 0, 150], ["#e11d48", "#000000", "#10b981"])
    const likeStampOpacity = useTransform(x, [30, 120], [0, 1])
    const nopeStampOpacity = useTransform(x, [-120, -30], [1, 0])

    return (
        <div className="relative flex w-[90vw] max-w-sm flex-col">
            <motion.div
                style={{ x, rotate }}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                    if (info.offset.x > 100) {
                        onLike()
                    } else if (info.offset.x < -100) {
                        onDislike()
                    }
                }}
                className="relative h-[60dvh] w-full max-w-sm cursor-grab overflow-hidden rounded-3xl border border-white/15 bg-sky-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:cursor-grabbing sm:max-w-md"
            >
                {game.background_image ? (
                    <Image
                        className="object-cover"
                        src={game.background_image}
                        alt={game.name}
                        fill
                        sizes="(max-width: 640px) 90vw, 384px"
                        priority
                        draggable={false}
                    />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-sky-800 to-sky-950" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-sky-950 via-sky-950/50 to-transparent" />

                <motion.div
                    className="absolute inset-0 mix-blend-overlay"
                    style={{ opacity: overlayOpacity, backgroundColor: overlayColor }}
                />

                <motion.div
                    style={{ opacity: likeStampOpacity }}
                    className="pointer-events-none absolute top-8 left-6 z-20 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1 text-3xl font-black tracking-widest text-emerald-400"
                >
                    LIKE
                </motion.div>

                <motion.div
                    style={{ opacity: nopeStampOpacity }}
                    className="pointer-events-none absolute top-8 right-6 z-20 rotate-12 rounded-xl border-4 border-rose-400 px-3 py-1 text-3xl font-black tracking-widest text-rose-400"
                >
                    NOPE
                </motion.div>

                <div className="pointer-events-none absolute bottom-6 z-10 flex w-full flex-col gap-3 px-6">
                    <h2 className="text-3xl leading-tight font-black text-white drop-shadow-md sm:text-4xl">
                        {game.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-sky-100">
                        {game.rating > 0 && (
                            <span className={`rounded-lg px-2.5 py-1 shadow-sm ${ratingClass(game.rating)}`}>
                                ★ {game.rating}
                            </span>
                        )}

                        {game.released && (
                            <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                                {game.released}
                            </span>
                        )}
                    </div>

                    {game.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {game.platforms.slice(0, 4).map((platform) => (
                                <span
                                    key={platform}
                                    className="rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-sky-950 shadow-sm"
                                >
                                    {platform}
                                </span>
                            ))}
                        </div>
                    )}

                    {game.genres && game.genres.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {game.genres.slice(0, 3).map((genre) => (
                                <span key={genre} className="text-sm font-medium text-sky-300 drop-shadow-sm">
                                    #{genre}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-6">
                <button
                    type="button"
                    aria-label="Dislike"
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-rose-300 shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-rose-500/20"
                    onClick={onDislike}
                >
                    <X size={32} strokeWidth={3} />
                </button>

                <button
                    type="button"
                    aria-label="Undo"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sky-200 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                    onClick={onUndo}
                >
                    <Undo2 size={22} strokeWidth={3} />
                </button>

                <button
                    type="button"
                    aria-label="Like"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_0_30px_rgba(14,165,233,0.55)] transition-all hover:scale-105 hover:bg-sky-400"
                    onClick={onLike}
                >
                    <Heart fill="currentColor" size={30} strokeWidth={3} />
                </button>
            </div>
        </div>
    )
}