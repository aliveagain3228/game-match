import Image from "next/image"
import type { GameTypes } from "@/types/game"

interface MatchOverlayProps {
    game: GameTypes
    onContinue: () => void
}

export default function MatchOverlay({ game, onContinue }: MatchOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-900 px-4 text-center">
            <h1 className="text-6xl font-black text-sky-300 mb-6 animate-bounce">
                🎉 MATCH! 🎉
            </h1>
            <p className="text-sky-50 text-2xl mb-8 font-medium">
                You and your friend picked the same game!
            </p>

            <div className="bg-sky-800 p-6 rounded-2xl shadow-xl mb-12 border border-sky-700 flex flex-col items-center gap-4">
                {game.background_image && (
                    <Image
                        src={game.background_image}
                        alt={game.name}
                        width={320}
                        height={180}
                        className="rounded-xl w-80 max-w-full h-auto object-cover"
                    />
                )}
                <h2 className="text-3xl font-bold text-white">{game.name}</h2>
            </div>

            <button
                type="button"
                onClick={onContinue}
                className="px-10 py-4 bg-sky-400 text-sky-950 rounded-full font-bold text-xl shadow-lg hover:bg-sky-300 hover:scale-105 transition-all"
            >
                Continue swiping
            </button>
        </div>
    )
}