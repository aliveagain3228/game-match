const ROOM_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

export const createRoomCode = () =>
    Array.from(
        crypto.getRandomValues(new Uint8Array(6)),
        (byte) => ROOM_ALPHABET[byte % ROOM_ALPHABET.length]
    ).join('')

export const buildRoomUrl = (roomId: string, filter: string) => {
    const params = new URLSearchParams({ room: roomId })

    if (filter) params.set('filter', filter)

    return `/room?${params}`
}