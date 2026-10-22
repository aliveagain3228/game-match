'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";


export default function SwipeContainer() {
    const {games, setGames, swipeRight, swipeLeft, undoSwipe} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadGames() {

            if ( games.length > 0 ) {
                return
            }

            setIsLoading(true);

            try {
                const result = await getGames(page);
                setGames(result);
                setPage(page + 1)
            } catch {
                setError("The games could not be loaded. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadGames();
    }, [games.length, page, setGames]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 overflow-hidden">
        {error != null ? (
            error
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
