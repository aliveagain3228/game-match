import {GameTypes} from "@/services/rawg.service"
import {create} from "zustand";
import { persist } from "zustand/middleware/persist";

interface GameState {
    games: GameTypes[],
    likedGames: GameTypes[],
    dislikedGames: GameTypes[],
    history: { game: GameTypes; action: "like" | "dislike" }[]
    addGames: ( newGames: GameTypes[] ) => void
    matchedGames: GameTypes[]
    addMatchedGame: ( game: GameTypes ) => void

    setGames: (games: GameTypes[]) => void
    swipeRight: () => void
    swipeLeft: () => void
    undoSwipe: () => void
    setMatchedGame: ( games: GameTypes[]) => void
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            games: [],
            likedGames: [],
            dislikedGames: [],
            history: [],
            matchedGames: [],

            setMatchedGame: (games) => set({ matchedGames: games}),

            addMatchedGame: (game) => set((state) => {
                if (state.matchedGames.some(g => g.id === game.id)) return state
                return { matchedGames: [...state.matchedGames, game] }
            }),
            setGames: (games) => set({games}),

            addGames: (newGames) => set((state) => {
                const seenIds = new Set([
                    ...state.games.map(g => g.id),
                    ...state.likedGames.map(g => g.id),
                    ...state.dislikedGames.map(g => g.id)
                ])
                const uniqueGames = newGames.filter(g => !seenIds.has(g.id))
                return { games: [...state.games, ...uniqueGames] }
            }),

            swipeRight: () => set((state) => {
                if (state.games.length === 0) {
                    return state
                }
                const currentGame = state.games[0]
                return {
                    likedGames: [...state.likedGames, currentGame],
                    games: state.games.slice(1),
                    history: [...state.history, {game: currentGame, action: 'like'}]
                }
            }),
            swipeLeft: () => set((state) => {
                if (state.games.length === 0) {
                    return state
                }
                const currentGame = state.games[0]
                return {
                    dislikedGames: [...state.dislikedGames, currentGame],
                    games: state.games.slice(1),
                    history: [...state.history, {game: currentGame, action: 'dislike'}]
                }
            }),
            undoSwipe: () => set((state) => {
                if (state.history.length === 0) {
                    return state
                }

                const lastHistoryEntry = state.history[state.history.length - 1]

                if (lastHistoryEntry.action === "like") {
                    return {
                        games: [lastHistoryEntry.game, ...state.games],
                        likedGames: state.likedGames.slice(0, -1),
                        history: state.history.slice(0, -1)
                    }
                } else {
                    return {
                        games: [lastHistoryEntry.game, ...state.games],
                        dislikedGames: state.dislikedGames.slice(0, -1),
                        history: state.history.slice(0, -1)
                    }
                }
            })
        }),
        {
            name: 'game-match-storage'
        }
    )
)
