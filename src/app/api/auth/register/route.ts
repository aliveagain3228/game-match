import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import bcrypt from 'bcryptjs'
import { z } from "zod"

const registerSchema = z.object({
    name: z.string().min(2, "The name is too short").max(32, "The name is too long"),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid email format"),
    password: z.string().min(6, "The password must be at least 6 characters long"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validation = registerSchema.safeParse(body)

        if (!validation.success) {
            const errorList = validation.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }))

            return NextResponse.json(
                { message: "Validation error", errors: errorList },
                { status: 400}
            )
        }

        const { name, email, password } = validation.data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            return NextResponse.json(
                { message: "A user with that email address already exists"},
                { status: 400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        return NextResponse.json(
            { message: "The user has been successfully created", user: { id: newUser.id, email: newUser.email }},
            { status: 201 }
        )
    } catch {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500})
    }
}