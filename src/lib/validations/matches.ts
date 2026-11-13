import { z } from "zod"

export const createMatchSchema = z.object({
    gameId: z.coerce.number().int().positive("Invalid game ID"),
    gameName: z.string().trim().min(1, "Game name is required").max(100, "Game name is  too long"),
    gameImage: z
        .string()
        .trim()
        .pipe(z.url("Invalid image URL"))
        .optional()
        .or(z.literal("")),
})