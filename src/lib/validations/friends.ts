import { z } from "zod";

export const sendFriendRequestSchema = z.object({
    targetId: z.string().trim().min(1, "Target user ID is required"),
})

export const respondFriendRequestSchema = z.object({
    requestId: z.string().trim().min(1, "Request ID is required"),
    action: z.enum(["ACCEPT", "DECLINE"]),
})