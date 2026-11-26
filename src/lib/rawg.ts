import type { GameTypes } from "@/types/game"

export interface RawgGame {
    id: number
    name: string
    background_image: string | null
    rating: number
    genres: { name: string }[] | null
    parent_platforms: { platform: { name: string } }[] | null
    released: string | null
}

const ALLOWED_TAGS = new Set(["co-op", "multiplayer", "singleplayer"])
const ALLOWED_PLATFORMS = new Set(["4", "18,187", "1,186"])

export function buildRawgQuery(source: URLSearchParams): URLSearchParams {
    const params = new URLSearchParams({
        dates: `2010-01-01,${new Date().getFullYear() + 1}-12-31`,
    })

    const tags = source.get("tags")
    const platforms = source.get("platforms")

    if (tags && ALLOWED_TAGS.has(tags)) params.set("tags", tags)
    if (platforms && ALLOWED_PLATFORMS.has(platforms)) params.set("platforms", platforms)

    return params
}

export function mapRawgToGame(game: RawgGame): GameTypes {
    return {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: (game.genres ?? []).map((genre) => genre.name),
        platforms: (game.parent_platforms ?? []).map((item) => item.platform.name),
        released: game.released ? game.released.substring(0, 4) : "TBA",
    }
}