export interface GameTypes {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    genres?: string[];
    platforms: string[];
    released: string;
    parent_platforms?: string[];
}

interface RawgGame {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    genres: {name: string}[];
    parent_platforms: {platform:  {name: string}}[];
    released: string;
}

export function mapRawgToGame(game: RawgGame): GameTypes {
    return {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
        platforms: game.parent_platforms.map((i) => i.platform.name),
        released: game.released ? game.released.substring(0, 4) : "TBA",
    }
}

export async function getGames( page: number = 1, filterQuery: string = "" ): Promise<GameTypes[]> {
    const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY
    if (!apiKey) throw new Error('RAWG_API_KEY is missing')


    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page=${page}&dates=2010-01-01,2026-12-31${filterQuery}`)
    if (!response.ok) {
        throw new Error(`RAWG request failed: HTTP ${response.status}`)
    }
        const data = await response.json()

        return data.results.map(mapRawgToGame)
}

export async function checkGameCount(filterQuery: string = ""): Promise<number> {
    const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY
    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=2010-01-01,2026-12-31&page_size=1${filterQuery}`)
    const data = await response.json()
    return data.count
}