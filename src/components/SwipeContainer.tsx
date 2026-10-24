'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";
import { socket} from "@/sockets";


export default function SwipeContainer() {
    const {games, setGames, swipeRight, swipeLeft, undoSwipe} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {



        socket.connect()
        socket.emit('join_room', { roomId: 'test-room-123' })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        async function loadGames() {

            if ( games.length > 0 || !hasMore ) return

            setIsLoading(true);

            const pageToSearch = games.length === 0 ? Math.floor(Math.random() * 100) + 1 : page

            try {
                const result = await getGames(pageToSearch);
                if ( result.length === 0 )  {
                  return setHasMore(false)
                }
                setGames(result);
                setPage(pageToSearch + 1)
            } catch {
                setError("The games could not be loaded. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadGames();
    }, [games.length, page, setGames, hasMore]);
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
                    onLike={swipeRight}
                    onDislike={swipeLeft}
                    onUndo={undoSwipe}
                />
            </AnimatePresence>
        )}

    </div>)
}
