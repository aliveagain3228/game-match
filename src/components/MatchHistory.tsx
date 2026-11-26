import Image from "next/image"
import type { GameTypes } from "@/types/game"

interface MatchHistoryProps {
    games: GameTypes[]
    onClose: () => void
}

export default function MatchHistory({ games, onClose }: MatchHistoryProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Our games"
            className="fixed inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex items-end sm:justify-end sm:items-start"
        >
            <div className="w-full sm:max-w-md bg-white h-[85dvh] sm:h-full rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
                <div className="w-12 h-1.5 bg-sky-200 rounded-full mx-auto mb-6 sm:hidden"></div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-sky-900">Our games</h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="text-2xl hover:scale-110 transition-transform"
                    >
                        ❌
                    </button>
                </div>

                {games.length === 0 ? (
                    <p className="text-sky-600 text-center mt-10 font-medium">
                        You haven&apos;t found any matches yet. Keep swiping!
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="flex items-center gap-4 bg-sky-50 p-3 rounded-xl border border-sky-100"
                            >
                                {game.background_image ? (
                                    <Image
                                        src={game.background_image}
                                        alt={game.name}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-sky-200" />
                                )}
                                <p className="font-bold text-sky-900 text-lg">{game.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}