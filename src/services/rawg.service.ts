export interface GameTypes {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    genres: string[];
    platforms: string[];
}

interface RawgGame {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    genres: {name: string}[];
    parent_platforms: {platform:  {name: string}}[];
}

export function mapRawgToGame(game: RawgGame): GameTypes {
    return {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
        platforms: game.parent_platforms.map((i) => i.platform.name),
    }
}

export async function getGames(): Promise<GameTypes[]> {
    const apiKey = process.env.RAWG_API_KEY
    if (!apiKey) {
        throw new Error('RAWG_API_KEY is missing')
    }
    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}`)

        const data = await response.json()

        return data.results.map(mapRawgToGame)
}