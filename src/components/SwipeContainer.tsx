'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { getGames } from "@/services/rawg.service"
import { getMatches } from "@/services/matches.service"
import { useGameStore } from "@/store/useGameStore"
import { useRoomSocket } from "@/hooks/useRoomSocket"
import GameCard from "./GameCard"
import MatchOverlay from "./MatchOverlay"
import MatchHistory from "./MatchHistory"

interface SwipeContainerProps {
    roomId: string
    filter: string
}

const PREFETCH_THRESHOLD = 3

export default function SwipeContainer({ roomId, filter }: SwipeContainerProps) {
    const { status } = useSession()
    const {
        games,
        history,
        likedGames,
        matchedGames,
        addGames,
        swipeRight,
        swipeLeft,
        undoSwipe,
        setMatchedGames,
    } = useGameStore()

    const { setup, roomError, matchedGameId, peerNotice, sendSwipe, sendUnswipe, clearMatch } =
        useRoomSocket({ roomId, filter, enabled: status === "authenticated" })

    const [nextPage, setNextPage] = useState<number | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [exitDirection, setExitDirection] = useState(0)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const isFetchingRef = useRef(false)
    const isAliveRef = useRef(true)

    const currentPage = nextPage ?? setup?.startPage ?? null

    useEffect(() => {
        isAliveRef.current = true
        return () => {
            isAliveRef.current = false
        }
    }, [])

    useEffect(() => {
        if (status !== "authenticated") return

        getMatches()
            .then((matches) => {
                if (isAliveRef.current) setMatchedGames(matches)
            })
            .catch((error) => console.error("Failed to load history", error))
    }, [status, setMatchedGames])

    useEffect(() => {
        if (!setup || currentPage === null || !hasMore) return
        if (games.length > PREFETCH_THRESHOLD || isFetchingRef.current) return

        isFetchingRef.current = true

        getGames(currentPage, setup.filter)
            .then((result) => {
                if (!isAliveRef.current) return

                if (result.length === 0) {
                    if (currentPage > 1 && useGameStore.getState().games.length === 0) {
                        setNextPage(1)
                    } else {
                        setHasMore(false)
                    }
                    return
                }

                addGames(result)
                setNextPage(currentPage + 1)
            })
            .catch(() => {
                if (!isAliveRef.current) return

                setLoadError("The games could not be loaded. Please try again later.")
                setHasMore(false)
            })
            .finally(() => {
                isFetchingRef.current = false
            })
    }, [setup, currentPage, hasMore, games.length, addGames])

    useEffect(() => {
        if (!isCopied) return

        const timer = setTimeout(() => setIsCopied(false), 2000)
        return () => clearTimeout(timer)
    }, [isCopied])

    const currentGame = games[0]

    const handleLike = () => {
        if (!currentGame) return

        sendSwipe(currentGame.id, "LIKE")
        setExitDirection(1)
        swipeRight()
    }

    const handleDislike = () => {
        if (!currentGame) return

        sendSwipe(currentGame.id, "DISLIKE")
        setExitDirection(-1)
        swipeLeft()
    }

    const handleUndo = () => {
        const lastEntry = history.at(-1)

        if (!lastEntry) return

        if (lastEntry.action === "like") {
            sendUnswipe(lastEntry.game.id)
        }

        setExitDirection(0)
        undoSwipe()
    }

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(roomId)
            setIsCopied(true)
        } catch {
            console.error("Clipboard is not available")
        }
    }

    const matchedGame = matchedGameId === null
        ? undefined
        : likedGames.find((game) => game.id === matchedGameId)

    if (matchedGame) {
        return <MatchOverlay game={matchedGame} onContinue={clearMatch} />
    }

    const visibleError = status === "unauthenticated"
        ? "Please sign in to join a room."
        : roomError ?? (games.length === 0 ? loadError : null)

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50 overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-4 bg-sky-950/90 backdrop-blur-md flex justify-between items-center z-40 border-b border-sky-800 shadow-md">
                <div className="flex gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white font-bold bg-sky-800 px-4 py-2 rounded-xl hover:bg-sky-700 transition-all"
                    >
                        ⬅ Lobby
                    </Link>
                    <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-sky-200 hover:bg-sky-100 hover:scale-105 transition-transform text-sky-900 font-bold"
                    >
                        {isCopied ? "✅ Copied" : "🔗 Copy Code"}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-sky-400 transition-all shadow-md"
                >
                    🏆 Matches
                    <span className="bg-sky-700 px-2 py-0.5 rounded-full text-sm">
                        {matchedGames.length}
                    </span>
                </button>
            </div>

            {peerNotice && (
                <div className="absolute top-24 z-40 bg-emerald-500 text-white font-bold px-5 py-2 rounded-full shadow-lg">
                    {peerNotice}
                </div>
            )}

            {isHistoryOpen && (
                <MatchHistory games={matchedGames} onClose={() => setIsHistoryOpen(false)} />
            )}

            {visibleError ? (
                <div className="text-xl text-rose-500 font-bold bg-rose-100 px-6 py-4 rounded-2xl border border-rose-200 z-10">
                    {visibleError}
                </div>
            ) : currentGame ? (
                <AnimatePresence mode="wait" custom={exitDirection}>
                    <GameCard
                        key={currentGame.id}
                        game={currentGame}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onUndo={handleUndo}
                    />
                </AnimatePresence>
            ) : setup && !hasMore ? (
                <div className="text-2xl font-bold text-sky-900 z-10">
                    No more games available!
                </div>
            ) : (
                <div className="flex flex-col items-center animate-pulse z-10">
                    <div className="text-6xl mb-4">⏳</div>
                    <p className="text-xl font-bold text-sky-900">
                        {setup ? "Loading games..." : "Connecting to the room..."}
                    </p>
                </div>
            )}
        </div>
    )
}