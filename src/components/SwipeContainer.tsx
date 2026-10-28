'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState, useRef} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";
import { socket } from "@/sockets";
import { useRouter } from "next/navigation";


export default function SwipeContainer() {
    const {games, addGames, swipeRight, likedGames, swipeLeft, undoSwipe, matchedGames} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true)
    const [matchedGameId, setMatchedGameId] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSocketReady, setIsSocketReady] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const roomIdRef = useRef<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("")

    const router = useRouter();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)
        const currentRoom = params.get('room') || Math.random().toString(36).substring(2, 8);
        const currentFilter = params.get('filter') || ''

        if (!params.get('room')) {
            window.history.replaceState(null, "", `?room=${currentRoom}${currentFilter ? `&filter=${currentFilter}` : ''}`);
        }

        roomIdRef.current = currentRoom;
        socket.connect()

        socket.emit('join_room', { roomId: currentRoom, filter: currentFilter });

        socket.on('match', (data) => {
            console.log("Server provided match game ID:", data.gameId)
            setMatchedGameId(data.gameId)

            const gameToSave = useGameStore.getState().likedGames.find(g => g.id === data.gameId)
            if (gameToSave) {
                useGameStore.getState().addMatchedGame(gameToSave)
            }
        })

        socket.on('room_setup', (data) => {
            console.log("Server provided start page:", data.startPage, "and filter:", data.filter);
            setPage(data.startPage)
            setActiveFilter(data.filter)
            setIsSocketReady(true)
        })

        return () => {
            socket.off('room_setup')
            socket.off('match')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        async function loadGames() {
            if (!isSocketReady) return
            if ( games.length > 3 || !hasMore ) return

            setIsLoading(true);

            const pageToSearch = page

            try {
                const result = await getGames(pageToSearch, activeFilter);
                if ( result.length === 0 )  {
                  return setHasMore(false)
                }

                addGames(result);
                setPage(pageToSearch + 1)
            } catch {
                setError("The games could not be loaded. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadGames();
    }, [games.length, page, addGames, hasMore, isSocketReady, activeFilter]);

    const handleLike = () => {
        const room = roomIdRef.current
        if (room && games.length > 0) {
            socket.emit('swipe', { roomId: room, gameId: games[0].id, action: 'LIKE' });
        }
        swipeRight()
    }

    const handleDislike = () => {
        const room = roomIdRef.current
        if (room && games.length > 0) {
            socket.emit('swipe', { roomId: room, gameId: games[0].id, action: 'DISLIKE' });
        }
        swipeLeft()
    }

    const handleCopyCode = () => {
        const room = roomIdRef.current
        if (room) {
            void navigator.clipboard.writeText(room);
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const matchedGame = likedGames.find((g) => g.id === matchedGameId)

    if (matchedGameId && matchedGame) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-sky-900 w-full absolute top-0 left-0 z-50 px-4 text-center">
                <h1 className="text-6xl font-black text-sky-300 mb-6 animate-bounce">
                    🎉 MATCH! 🎉
                </h1>
                <p className="text-sky-50 text-2xl mb-8 font-medium">
                    You and your friend picked the same game!
                </p>

                <div className="bg-sky-800 p-6 rounded-2xl shadow-xl mb-12 border border-sky-700">
                    <h2 className="text-3xl font-bold text-white">
                        {matchedGame.name}
                    </h2>
                </div>

                <button
                    onClick={() => setMatchedGameId(null)}
                    className="px-10 py-4 bg-sky-400 text-sky-950 rounded-full font-bold text-xl shadow-lg hover:bg-sky-300 hover:scale-105 transition-all"
                >
                    Continue swiping
                </button>
            </div>
        )
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 overflow-hidden">

            <div className="absolute top-0 left-0 w-full p-4 bg-sky-950/90 backdrop-blur-md flex justify-between items-center z-40 border-b border-sky-800 shadow-md">

                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-white font-bold bg-sky-800 px-4 py-2 rounded-xl hover:bg-sky-700 transition-all"
                    >
                        ⬅ Lobby
                    </button>
                    <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-sky-200 hover:bg-sky-100 hover:scale-105 transition-transform text-sky-900 font-bold"
                    >
                        {isCopied ? "✅ Copied" : "🔗 Copy Code"}
                    </button>
                </div>

                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-md"
                >
                    🏆 Matches <span className="bg-sky-700 px-2 py-0.5 rounded-full text-sm">
                    {matchedGames.length}
                </span>
                </button>
            </div>

            {isHistoryOpen && (
                <div className="absolute inset-0 bg-sky-950/80 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-sky-900">Our games</h2>
                            <button
                                onClick={() => setIsHistoryOpen(false)}
                                className="text-2xl hover:scale-110 transition-transform"
                            >
                                ❌
                            </button>
                        </div>

                        {matchedGames.length === 0 ? (
                            <p className="text-sky-600 text-center mt-10 font-medium">You haven&apos;t found any matches yet. Keep swiping!</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {matchedGames.map(game => (
                                    <div
                                        key={game.id}
                                        className="flex items-center gap-4 bg-sky-50 p-3 rounded-xl border border-sky-100"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={game.background_image} alt={game.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                                        <p className="font-bold text-sky-900 text-lg">{game.name}</p>
                                    </div>
                                    ))}
                            </div>
                            )}
                    </div>
                </div>
            )}

        {error != null ? (
            error
        ) : games.length === 0 && !hasMore ? (
            <div
                className="text-2xl font-bold text-sky-900"
            >
                No more games available!
            </div>
            ) : isLoading || games.length === 0 ? (
            <p>Loading games...</p>
        ) : (
            <AnimatePresence mode="wait">
                <GameCard
                    game={games[0]}
                    key={games[0].id}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onUndo={undoSwipe}
                />
            </AnimatePresence>
        )}
    </div>)
}
