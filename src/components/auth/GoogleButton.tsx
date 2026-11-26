import { FcGoogle } from "react-icons/fc"

interface GoogleButtonProps {
    onClick: () => void
    disabled: boolean
    loading: boolean
}

export default function GoogleButton({ onClick, disabled, loading }: GoogleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#1E293B] text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-sm group disabled:opacity-50"
        >
            <FcGoogle size={26} className="group-hover:scale-110 transition-transform" />
            {loading ? "Connecting..." : "Google"}
        </button>
    )
}