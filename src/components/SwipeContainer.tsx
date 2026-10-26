'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";
import { socket} from "@/sockets";


export default function SwipeContainer() {
    const {games, addGames, swipeRight, swipeLeft, undoSwipe} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true)
    const [matchedGameId, setMatchedGameId] = useState<string | null>(null);

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 overflow-hidden">
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
