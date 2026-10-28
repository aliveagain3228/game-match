import {GameTypes} from "@/services/rawg.service";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Undo2 } from "lucide-react";

interface GameCardProps {
    game: GameTypes
    onLike: () => void
    onDislike: () => void
    onUndo: () => void
}

export default function GameCard({game, onLike, onDislike, onUndo}: GameCardProps) {

    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-18, 18])
    const overlayOpacity = useTransform(x, [-150, 0, 150], [0.6, 0, 0.6])
    const overlayColor = useTransform(x, [-150, 0, 150], ["#e11d48", "#000000", "#10b981"])

    return (
            <div className="relative w-[90vw] max-w-sm flex flex-col">

                <motion.div
                    style={{ x, rotate }}
                    initial={{ opacity: 0, scale: 0.9, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                        x: x.get() > 0 ? 500 : x.get() < 0 ? -500 : 0,
                        y: x.get() === 0 ? 200 : 0,
                        opacity: 0,
                        transition: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={( _, info) => {
                        if (info.offset.x > 100) {
                            onLike()
                        } else if (info.offset.x < -100) {
                            onDislike()
                        }
                    }}
                    className="relative h-[65vh] w-full rounded-3xl shadow-2xl overflow-hidden sm:max-w-md max-w-sm"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={game.background_image}
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/60 to-transparent pointer-events-none" />
                    <motion.div
                        className="absolute inset-0 mix-blend-overlay"
                        style={{ opacity: overlayOpacity, backgroundColor: overlayColor }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/20 to-transparent"></div>
                    <div className="absolute bottom-28 w-full px-6 flex flex-col gap-3 pointer-events-none z-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-md"
                        >
                            {game.name}
                        </h2>
                        <div className="flex items-center gap-3 text-sm font-bold text-sky-100">
                            {game.rating > 0 && (
                                <span className="bg-sky-600/80 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                                    {game.rating}
                                </span>
                            )}

                            {game.released && (
                                <span className="bg-sky-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-sky-700 shadow-sm">
                                   📅 {game.released}
                                </span>
                            )}

                            {game.platforms && game.platforms.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {game.platforms.slice(0, 4).map((platform) => (
                                        <span
                                            key={platform}
                                            className="text-xs font-bold text-sky-950 bg-white/90 px-2 py-1 rounded-md shadow-sm"
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {game.genres && game.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {game.genres.slice(0, 3).map((genre) => (
                                        <span
                                            key={genre}
                                            className="text-sm font-medium text-sky-300 drop-shadow-sm"
                                        >
                                            #{genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>

                </motion.div>
                <div
                    className="flex justify-center items-center gap-6 mt-8"
                >
                    <button
                        className="w-16 h-16 flex justify-center items-center rounded-full bg-white text-slate-400 shadow-xl border border-slate-100 hover:scale-105 transition-transform font-bold text-xl"
                        onClick={onDislike}
                    >
                        <X size={32} strokeWidth={3}/>
                    </button>

                    <button
                        className="w-12 h-12 flex justify-center items-center rounded-full bg-white text-sky-400 shadow-md border border-sky-50 hover:scale-105 transition-transform text-sm"
                        onClick={onUndo}
                    >
                        <Undo2 size={24} strokeWidth={3} />
                    </button>

                    <button
                        className="w-16 h-16 flex justify-center items-center rounded-full bg-white text-sky-500 shadow-xl border border-sky-100 hover:scale-105 transition-transform font-bold text-xl"
                        onClick={onLike}
                    >
                        <Heart fill="currenColor" size={32} strokeWidth={3} />
                    </button>

                </div>
            </div>

    )

}

