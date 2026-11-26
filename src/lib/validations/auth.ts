import { z } from 'zod'

const emailField = z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email format"))

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1, "Password is required").max(72),
})

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "The name is too short")
        .max(32, "The name is too long"),
    email: emailField,
    password: z
        .string()
        .min(6, "The password must be at least 6 characters long")
        .max(72, "The password is too long"),
})

export const registerFormSchema = registerSchema
    .extend({
        confirmPassword: z.string().min(1, "Please repeat the password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterFormInput = z.infer<typeof registerFormSchema>