'use client'

import { useCallback, useEffect, useState } from "react"
import { socket } from "@/sockets"
import { useGameStore } from "@/store/useGameStore"
import { saveMatch } from "@/services/matches.service"

interface RoomSetup {
    startPage: number
    filter: string
}

interface UseRoomSocketOptions {
    roomId: string
    filter: string
    enabled: boolean
}

export function useRoomSocket({ roomId, filter, enabled }: UseRoomSocketOptions) {
    const [setup, setSetup] = useState<RoomSetup | null>(null)
    const [roomError, setRoomError] = useState<string | null>(null)
    const [matchedGameId, setMatchedGameId] = useState<number | null>(null)
    const [peerNotice, setPeerNotice] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled) return

        void useGameStore.persist.rehydrate()
        useGameStore.getState().enterRoom(roomId)

        const shownMatches = new Set<number>()
        let noticeTimer: ReturnType<typeof setTimeout> | undefined

        const joinRoom = () => {
            const liked = useGameStore.getState().likedGames.map((game) => game.id)
            socket.emit("join_room", { roomId, filter, liked })
        }

        const handleSetup = (data: RoomSetup) => {
            setRoomError(null)
            setSetup((current) => current ?? data)
        }

        const handleRoomError = (data: { message: string }) => {
            setRoomError(data.message)
        }

        const handleConnectError = (error: Error) => {
            setRoomError(
                error.message === "unauthorized"
                    ? "Your session could not be verified. Please sign in again."
                    : "Could not reach the game server. Retrying..."
            )
        }

        const handlePlayerJoined = (data: { message: string }) => {
            setPeerNotice(data.message)
            clearTimeout(noticeTimer)
            noticeTimer = setTimeout(() => setPeerNotice(null), 3000)
        }

        const handleMatch = ({ gameId }: { gameId: number }) => {
            if (shownMatches.has(gameId)) return
            shownMatches.add(gameId)

            setMatchedGameId(gameId)

            const store = useGameStore.getState()
            const game = store.likedGames.find((item) => item.id === gameId)

            if (!game) return

            store.addMatchedGame(game)
            void saveMatch(game)
        }

        socket.on("connect", joinRoom)
        socket.on("connect_error", handleConnectError)
        socket.on("room_setup", handleSetup)
        socket.on("room_error", handleRoomError)
        socket.on("player_joined", handlePlayerJoined)
        socket.on("match", handleMatch)

        if (socket.connected) {
            joinRoom()
        } else {
            socket.connect()
        }

        return () => {
            clearTimeout(noticeTimer)
            socket.off("connect", joinRoom)
            socket.off("connect_error", handleConnectError)
            socket.off("room_setup", handleSetup)
            socket.off("room_error", handleRoomError)
            socket.off("player_joined", handlePlayerJoined)
            socket.off("match", handleMatch)
            socket.disconnect()
        }
    }, [enabled, roomId, filter])

    const sendSwipe = useCallback(
        (gameId: number, action: "LIKE" | "DISLIKE") => {
            socket.emit("swipe", { roomId, gameId, action })
        },
        [roomId]
    )

    const sendUnswipe = useCallback(
        (gameId: number) => {
            socket.emit("unswipe", { roomId, gameId })
        },
        [roomId]
    )

    const clearMatch = useCallback(() => setMatchedGameId(null), [])

    return { setup, roomError, matchedGameId, peerNotice, sendSwipe, sendUnswipe, clearMatch }
}