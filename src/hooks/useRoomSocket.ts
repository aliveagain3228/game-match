'use client'

import { useCallback, useEffect, useState } from "react"
import { acquireSocket, releaseSocket, socket } from "@/sockets"
import { useGameStore } from "@/store/useGameStore"
import { saveMatch } from "@/services/matches.service"

interface RoomSetup {
    startPage: number
    filter: string
}

export interface PeerNotice {
    message: string
    kind: "joined" | "left"
}

interface UseRoomSocketOptions {
    roomId: string
    filter: string
    enabled: boolean
}

const JOINED_NOTICE_MS = 3000
const LEFT_NOTICE_MS = 5000

export function useRoomSocket({ roomId, filter, enabled }: UseRoomSocketOptions) {
    const [setup, setSetup] = useState<RoomSetup | null>(null)
    const [roomError, setRoomError] = useState<string | null>(null)
    const [matchedGameId, setMatchedGameId] = useState<number | null>(null)
    const [peerNotice, setPeerNotice] = useState<PeerNotice | null>(null)

    useEffect(() => {
        if (!enabled) return

        void useGameStore.persist.rehydrate()
        useGameStore.getState().enterRoom(roomId)

        const shownMatches = new Set<number>()
        let noticeTimer: ReturnType<typeof setTimeout> | undefined

        const showNotice = (notice: PeerNotice, duration: number) => {
            setPeerNotice(notice)
            clearTimeout(noticeTimer)
            noticeTimer = setTimeout(() => setPeerNotice(null), duration)
        }

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
            showNotice({ message: data.message, kind: "joined" }, JOINED_NOTICE_MS)
        }

        const handlePlayerLeft = (data: { message: string }) => {
            showNotice({ message: data.message, kind: "left" }, LEFT_NOTICE_MS)
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
        socket.on("player_left", handlePlayerLeft)
        socket.on("match", handleMatch)

        acquireSocket()

        if (socket.connected) joinRoom()

        return () => {
            clearTimeout(noticeTimer)
            socket.off("connect", joinRoom)
            socket.off("connect_error", handleConnectError)
            socket.off("room_setup", handleSetup)
            socket.off("room_error", handleRoomError)
            socket.off("player_joined", handlePlayerJoined)
            socket.off("player_left", handlePlayerLeft)
            socket.off("match", handleMatch)

            if (socket.connected) socket.emit("leave_room", { roomId })

            releaseSocket()
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