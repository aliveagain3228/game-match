'use client'

import { useEffect } from "react"
import { acquireSocket, releaseSocket } from "@/sockets"

export function useSocketPresence(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return

        acquireSocket()

        return () => releaseSocket()
    }, [enabled])
}