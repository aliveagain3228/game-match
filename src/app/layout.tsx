import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import AppBackground from "@/components/AppBackground";
import Header from "@/components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GameMatch",
    description: "Swipe games together and find the one you both want to play",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="flex min-h-full flex-col bg-sky-950">
        <AuthProvider>
            <AppBackground />
            <Header />
            <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </AuthProvider>
        </body>
        </html>
    );
}