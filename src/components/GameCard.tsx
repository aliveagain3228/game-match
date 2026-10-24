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
    const GameGenres = game.genres.slice(0, 2).join(', ')
    const GamePlatforms = game.platforms.slice(0, 2).join(', ')

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
                    onDragEnd={( event, info) => {
                        if (info.offset.x > 100) {
                            onLike()
                        } else if (info.offset.x < -100) {
                            onDislike()
                        }
                    }}
                    className="relative h-[65vh] w-full rounded-3xl shadow-2xl overflow-hidden"
                >
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={game.background_image}
                        alt=""
                    />
                    <motion.div
                        className="absolute inset-0 mix-blend-overlay"
                        style={{ opacity: overlayOpacity, backgroundColor: overlayColor }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                        <h2 className="text-white text-3xl font-bold tracking-wide shadow-sm"
                        >
                            {game.name}
                        </h2>
                        <div className="flex gap-2 flex-wrap mt-2">
                            <span
                                className="bg-black/40 text-white/90 rounded-full px-3 py-1 text-sm"
                            >
                                {game.released}
                            </span>
                                {GameGenres &&
                                    <span
                                        className="bg-black/40 text-white/90 rounded-full px-3 py-1 text-sm"
                                    >
                                    {GameGenres}
                                    </span>}
                            {GamePlatforms &&
                                <span
                                    className="bg-black/40 text-white/90 rounded-full px-3 py-1 text-sm"
                                >
                                    {GamePlatforms}
                                </span>}

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
                        <X size="{32}" strokeWidth="{3}"/>
                    </button>

                    <button
                        className="w-12 h-12 flex justify-center items-center rounded-full bg-white text-sky-400 shadow-md border border-sky-50 hover:scale-105 transition-transform text-sm"
                        onClick={onUndo}
                    >
                        <Undo2 size="{24}" strokeWidth="{3}" />
                    </button>

                    <button
                        className="w-16 h-16 flex justify-center items-center rounded-full bg-white text-sky-500 shadow-xl border border-sky-100 hover:scale-105 transition-transform font-bold text-xl"
                        onClick={onLike}
                    >
                        <Heart fill="currenColor" size="{32}" strokeWidth="{3}" />
                    </button>

                </div>
            </div>

    )

}

