import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'

async function fetchSocketToken(): Promise<string | undefined> {
    try {
        const res = await fetch('/api/socket-token', { cache: 'no-store' })

        if (!res.ok) return undefined

        const data = (await res.json()) as { token?: string }
        return data.token
    } catch {
        return undefined
    }
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001',
    {
        autoConnect: false,
        auth: (callback) => {
            void fetchSocketToken().then((token) => callback({ token }))
        },
    }
)