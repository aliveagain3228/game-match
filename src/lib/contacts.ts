import type { IconType } from "react-icons"
import { SiGithub, SiGmail, SiTelegram } from "react-icons/si"

export interface ContactLink {
    id: string
    label: string
    handle: string
    href: string
    Icon: IconType
    accent: string
}

export const CONTACTS: ContactLink[] = [
    {
        id: "telegram",
        label: "Telegram",
        handle: "@tellmewhy322",
        href: "https://t.me/tellmewhy322",
        Icon: SiTelegram,
        accent: "bg-sky-500",
    },
    {
        id: "gmail",
        label: "Gmail",
        handle: "kojda1337@gmail.com",
        href: "mailto:kojda1337@gmail.com",
        Icon: SiGmail,
        accent: "bg-rose-500",
    },
    {
        id: "github",
        label: "GitHub",
        handle: "aliveagain3228",
        href: "https://github.com/aliveagain3228",
        Icon: SiGithub,
        accent: "bg-slate-600",
    },
]