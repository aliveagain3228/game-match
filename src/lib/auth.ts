import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials)
                if (!parsed.success) {
                    throw new Error("Invalid email or password")
                }

                const { email, password } = parsed.data

                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if(!user || !user.password) {
                    throw new Error("Invalid email or password")
                }
                const isPasswordValid = await bcrypt.compare(password, user.password)

                if (!isPasswordValid) {
                    throw new Error("Invalid email or password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}