'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { useSession } from "next-auth/react"
import { ArrowLeftIcon, CheckIcon, LinkIcon, TrophyIcon } from "@phosphor-icons/react"
import { getGames } from "@/services/rawg.service"
import { getMatches } from "@/services/matches.service"
import { useGameStore } from "@/store/useGameStore"
import { useLeaveGuard } from "@/store/useLeaveGuard"
import { useRoomSocket } from "@/hooks/useRoomSocket"
import AmbientCover from "./AmbientCover"
import GameCard from "./GameCard"
import MatchOverlay from "./MatchOverlay"
import LeaveRoomDialog from "./LeaveRoomDialog"
import MatchHistory from "./MatchHistory"
import GameLoader from "./GameLoader"

interface SwipeContainerProps {
    roomId: string
    filter: string
}

const PREFETCH_THRESHOLD = 3

export default function SwipeContainer({ roomId, filter }: SwipeContainerProps) {
    const router = useRouter()
    const { status } = useSession()
    const pendingHref = useLeaveGuard((state) => state.pendingHref)
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
        useLeaveGuard.getState().setRoomActive(true)

        return () => useLeaveGuard.getState().setRoomActive(false)
    }, [])

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

    const handleConfirmLeave = () => {
        const guard = useLeaveGuard.getState()
        const href = guard.pendingHref ?? "/"

        guard.cancelLeave()
        router.push(href)
    }

    const matchedGame = matchedGameId === null
        ? undefined
        : likedGames.find((game) => game.id === matchedGameId)

    const visibleError = status === "unauthenticated"
        ? "Please sign in to join a room."
        : roomError ?? (games.length === 0 ? loadError : null)

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-36 pb-10">
            <AmbientCover src={currentGame?.background_image ?? null} />

            <div className="fixed inset-x-0 top-16 z-40 flex items-center justify-between border-b border-white/10 bg-sky-950/60 px-4 py-3 backdrop-blur-md sm:px-8">
                <div className="flex gap-2 sm:gap-3">
                    <button
                        type="button"
                        aria-label="Leave room"
                        onClick={() => useLeaveGuard.getState().requestLeave("/")}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-100 transition-all hover:bg-white/10"
                    >
                        <ArrowLeftIcon size={20} weight="bold" />
                    </button>
                    <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-sky-100 transition-all hover:bg-white/10 sm:px-4"
                    >
                        {isCopied ? <CheckIcon size={18} weight="bold" className="text-emerald-400" /> : <LinkIcon size={18} weight="bold" />}
                        {isCopied ? "Copied" : "Copy code"}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-bold text-sky-950 shadow-lg transition-all hover:bg-sky-400 sm:px-4"
                >
                    <TrophyIcon size={18} weight="fill" />
                    All matches
                    <motion.span
                        key={matchedGames.length}
                        initial={{ scale: 1.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 12 }}
                        className="rounded-full bg-sky-950 px-2 py-0.5 text-xs text-sky-200"
                    >
                        {matchedGames.length}
                    </motion.span>
                </button>
            </div>

            {peerNotice && (
                <div
                    className={`fixed top-32 left-1/2 z-40 -translate-x-1/2 rounded-full px-5 py-2 font-bold shadow-lg ${
                        peerNotice.kind === "left" ? "bg-amber-400 text-amber-950" : "bg-emerald-500 text-white"
                    }`}
                >
                    {peerNotice.message}
                </div>
            )}

            {visibleError ? (
                <div className="relative z-10 rounded-2xl border border-rose-400/30 bg-rose-950/60 px-6 py-4 text-center text-lg font-bold text-rose-300 backdrop-blur-md">
                    {visibleError}
                </div>
            ) : currentGame ? (
                <div className="relative z-10">
                    <AnimatePresence mode="wait" custom={exitDirection}>
                        <GameCard
                            key={currentGame.id}
                            game={currentGame}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onUndo={handleUndo}
                        />
                    </AnimatePresence>
                </div>
            ) : setup && !hasMore ? (
                <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-2xl font-bold text-sky-100 backdrop-blur-md">
                    No more games available!
                </div>
            ) : (
                <div className="relative z-10">
                    <GameLoader label={setup ? "Loading games" : "Connecting"} />
                </div>
            )}

            {isHistoryOpen && (
                <MatchHistory games={matchedGames} onClose={() => setIsHistoryOpen(false)} />
            )}

            {matchedGame && <MatchOverlay game={matchedGame} onContinue={clearMatch} />}

            {pendingHref !== null && (
                <LeaveRoomDialog
                    roomId={roomId}
                    onStay={() => useLeaveGuard.getState().cancelLeave()}
                    onLeave={handleConfirmLeave}
                />
            )}
        </div>
    )
}