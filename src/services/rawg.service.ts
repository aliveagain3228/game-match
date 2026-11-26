import type { GameTypes } from "@/types/game"

interface GamesResponse {
    count: number
    results: GameTypes[]
}

async function requestGames(params: URLSearchParams): Promise<GamesResponse> {
    const response = await fetch(`/api/games?${params}`)

    if (!response.ok) {
        throw new Error(`Games request failed: HTTP ${response.status}`)
    }

    return response.json()
}

export async function getGames(page: number = 1, filter: string = ""): Promise<GameTypes[]> {
    const params = new URLSearchParams(filter)
    params.set("page", String(page))

    const data = await requestGames(params)
    return data.results
}

export async function checkGameCount(filter: string = ""): Promise<number> {
    const params = new URLSearchParams(filter)
    params.set("countOnly", "1")

    const data = await requestGames(params)
    return data.count
}