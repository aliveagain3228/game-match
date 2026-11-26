import type { ComponentProps } from "react"

interface AuthInputProps extends ComponentProps<"input"> {
    error?: string
}

export default function AuthInput({ error, className = "", ...props }: AuthInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <input
                aria-invalid={error ? true : undefined}
                className={`w-full bg-[#0B0F19] border text-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder:text-slate-500 font-medium transition-all disabled:opacity-50 ${
                    error ? "border-rose-500/70" : "border-slate-700"
                } ${className}`}
                {...props}
            />
            {error && <p className="text-rose-400 text-sm font-medium ml-1">{error}</p>}
        </div>
    )
}