export interface GameTypes {
    id: number
    name: string
    background_image: string | null
    rating: number
    genres?: string[]
    platforms: string[]
    released: string
}