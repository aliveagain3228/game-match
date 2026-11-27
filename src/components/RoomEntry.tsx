'use client'

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SwipeContainer from "@/components/SwipeContainer"
import { buildRoomUrl, createRoomCode } from "@/lib/room"

export default function RoomEntry() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const roomId = searchParams.get("room")
    const filter = searchParams.get("filter") ?? ""

    useEffect(() => {
        if (!roomId) {
            router.replace(buildRoomUrl(createRoomCode(), filter))
        }
    }, [roomId, filter, router])

    if (!roomId) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="animate-pulse text-xl font-bold text-sky-200">Creating a room...</p>
            </div>
        )
    }

    return <SwipeContainer key={`${roomId}|${filter}`} roomId={roomId} filter={filter} />
}