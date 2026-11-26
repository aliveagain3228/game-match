import Image from "next/image"
import { User } from "lucide-react"

interface AvatarProps {
    src?: string | null
    name?: string | null
    size?: number
}

export default function Avatar({ src, name, size = 32 }: AvatarProps) {
    if (src) {
        return (
            <Image
                src={src}
                alt={name ?? "Avatar"}
                width={size}
                height={size}
                referrerPolicy="no-referrer"
                style={{ width: size, height: size }}
                className="rounded-full border border-sky-700 object-cover shadow-sm"
            />
        )
    }

    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-sky-800 border border-sky-700 flex items-center justify-center shadow-sm"
        >
            <User size={Math.round(size * 0.45)} className="text-sky-300" />
        </div>
    )
}