'use client'
import {getGames} from "@/services/rawg.service";
import {useEffect, useState} from "react";
import {useGameStore} from "@/store/useGameStore";
import GameCard from "./GameCard";
import { AnimatePresence } from "framer-motion";


export default function SwipeContainer() {
    const {games, setGames, swipeRight, swipeLeft, undoSwipe} = useGameStore();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function loadGames() {
            try {
                const result = await getGames();
                setGames(result);
            } catch {
                setError("The games could not be loaded. Please try again later.");
            }


        }

        void loadGames();
    }, [])
    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 overflow-hidden">
        {error != null ? (
            error
        ) : games.length === 0 ? (
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
