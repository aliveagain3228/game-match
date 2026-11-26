export interface ServerToClientEvents {
    room_setup: (data: { startPage: number; filter: string }) => void
    room_error: (data: { message: string }) => void
    player_joined: (data: { message: string }) => void
    match: (data: { gameId: number }) => void
}

export interface ClientToServerEvents {
    join_room: (data: { roomId: string; filter?: string; liked?: number[] }) => void
    swipe: (data: { roomId: string; gameId: number; action: 'LIKE' | 'DISLIKE' }) => void
    unswipe: (data: { roomId: string; gameId: number }) => void
    check_online: (ids: string[], ack: (online: string[]) => void) => void
}