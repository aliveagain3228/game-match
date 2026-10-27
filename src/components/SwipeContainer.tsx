'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";
import { socket} from "@/sockets";


export default function SwipeContainer() {
    const {games, addGames, swipeRight, likedGames, swipeLeft, undoSwipe} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true)
    const [matchedGameId, setMatchedGameId] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search)
        let currentRoom = params.get('room')

        if (!currentRoom) {
            currentRoom = Math.random().toString(36).substring(2, 8)
            window.history.replaceState(null, "", `?room=${currentRoom}`)
        }

        socket.connect()
        socket.emit('join_room', { roomId: currentRoom })

        socket.on('match', (data) => {
            console.log("WE HAVE A MATCH! GAME ID:", data.gameId)
            setMatchedGameId(data.gameId)
        })

        return () => {
            socket.off('match')
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        async function loadGames() {

            if ( games.length > 3 || !hasMore ) return

            setIsLoading(true);

            const pageToSearch = games.length === 0 ? Math.floor(Math.random() * 100) + 1 : page

            try {
                const result = await getGames(pageToSearch);
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
    }, [games.length, page, addGames, hasMore]);

    const handleLike = () => {
        const room = new URLSearchParams(window.location.search).get('room')
        if (room && games.length > 0) {
            socket.emit('swipe', { roomId: room, gameId: games[0].id, action: 'LIKE' });
        }
        swipeRight()
    }

    const handleDislike = () => {
        const room = new URLSearchParams(window.location.search).get('room')
        if (room && games.length > 0) {
            socket.emit('swipe', { roomId: room, gameId: games[0].id, action: 'DISLIKE' });
        }
        swipeLeft()
    }

    const handleCopyCode = () => {
        const room = new URLSearchParams(window.location.search).get('room')
        if (room) {
            navigator.clipboard.writeText(room);
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
            <div className="absolute top-6 left-6 z-40">
                <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-sky-100 hover:bg-white transition-all text-sky-900 font-bold"
                >
                    {isCopied ? "✅ Code is copied" : "🔗 Copy code"}
                </button>
            </div>
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
