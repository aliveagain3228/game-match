export default function AppBackground() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-sky-950">
            <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute -bottom-52 left-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -right-24 -bottom-40 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.12),transparent_60%)]" />
        </div>
    )
}