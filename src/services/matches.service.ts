import type { GameTypes } from "@/types/game"

interface MatchRecord {
    gameId: number
    gameName: string
    gameImage: string | null
}

export async function getMatches(): Promise<GameTypes[]> {
    const response = await fetch("/api/matches", { cache: "no-store" })

    if (!response.ok) {
        throw new Error(`Matches request failed: HTTP ${response.status}`)
    }

    const records = (await response.json()) as MatchRecord[]

    return records.map((record) => ({
        id: record.gameId,
        name: record.gameName,
        background_image: record.gameImage,
        rating: 0,
        platforms: [],
        released: "",
    }))
}

export async function saveMatch(game: GameTypes): Promise<void> {
    try {
        const response = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId: game.id,
                gameName: game.name,
                gameImage: game.background_image,
            }),
        })

        if (!response.ok) {
            console.error("Failed to save match:", response.status)
        }
    } catch (error) {
        console.error("Failed to save match:", error)
    }
}