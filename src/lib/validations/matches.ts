import { z } from "zod"

export const createMatchSchema = z.object({
    gameId: z.coerce.number().int().positive("Invalid game ID"),
    gameName: z
        .string()
        .trim()
        .min(1, "Game name is required")
        .max(200, "Game name is too long"),
    gameImage: z
        .union([
            z.url({ protocol: /^https$/, error: "Invalid image URL" }),
            z.literal(""),
        ])
        .nullish(),
})