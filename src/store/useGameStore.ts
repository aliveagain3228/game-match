import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameTypes } from "@/types/game"

interface HistoryEntry {
    game: GameTypes
    action: "like" | "dislike"
}

interface GameState {
    roomId: string | null
    games: GameTypes[]
    likedGames: GameTypes[]
    dislikedGames: GameTypes[]
    history: HistoryEntry[]
    matchedGames: GameTypes[]
    enterRoom: (roomId: string) => void
    addGames: (newGames: GameTypes[]) => void
    swipeRight: () => void
    swipeLeft: () => void
    undoSwipe: () => void
    addMatchedGame: (game: GameTypes) => void
    setMatchedGames: (games: GameTypes[]) => void
    reset: () => void
}

const emptyRoomState = {
    games: [] as GameTypes[],
    likedGames: [] as GameTypes[],
    dislikedGames: [] as GameTypes[],
    history: [] as HistoryEntry[],
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            roomId: null,
            ...emptyRoomState,
            matchedGames: [],

            enterRoom: (roomId) => set((state) => {
                if (state.roomId === roomId) return state
                return { roomId, ...emptyRoomState }
            }),

            addGames: (newGames) => set((state) => {
                const seenIds = new Set([
                    ...state.games.map((game) => game.id),
                    ...state.likedGames.map((game) => game.id),
                    ...state.dislikedGames.map((game) => game.id),
                ])
                const uniqueGames = newGames.filter((game) => !seenIds.has(game.id))
                return { games: [...state.games, ...uniqueGames] }
            }),

            swipeRight: () => set((state) => {
                const currentGame = state.games[0]
                if (!currentGame) return state
                return {
                    likedGames: [...state.likedGames, currentGame],
                    games: state.games.slice(1),
                    history: [...state.history, { game: currentGame, action: "like" }],
                }
            }),

            swipeLeft: () => set((state) => {
                const currentGame = state.games[0]
                if (!currentGame) return state
                return {
                    dislikedGames: [...state.dislikedGames, currentGame],
                    games: state.games.slice(1),
                    history: [...state.history, { game: currentGame, action: "dislike" }],
                }
            }),

            undoSwipe: () => set((state) => {
                const lastEntry = state.history.at(-1)
                if (!lastEntry) return state

                const { game, action } = lastEntry

                return {
                    games: [game, ...state.games],
                    likedGames: action === "like"
                        ? state.likedGames.filter((item) => item.id !== game.id)
                        : state.likedGames,
                    dislikedGames: action === "dislike"
                        ? state.dislikedGames.filter((item) => item.id !== game.id)
                        : state.dislikedGames,
                    history: state.history.slice(0, -1),
                }
            }),

            addMatchedGame: (game) => set((state) => {
                if (state.matchedGames.some((item) => item.id === game.id)) return state
                return { matchedGames: [game, ...state.matchedGames] }
            }),

            setMatchedGames: (games) => set({ matchedGames: games }),

            reset: () => set({ roomId: null, ...emptyRoomState, matchedGames: [] }),
        }),
        {
            name: "game-match-storage",
            skipHydration: true,
            partialize: (state) => ({
                roomId: state.roomId,
                games: state.games,
                likedGames: state.likedGames,
                dislikedGames: state.dislikedGames,
                history: state.history,
            }),
        }
    )
)