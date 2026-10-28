import { Link } from 'react-router'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink" aria-label="MyPrintables home">
      <img src="/brand/cube-mark.svg" alt="" className="h-7 w-7 shrink-0" />
      {!compact && (
        <span className="font-display text-[22px] font-extrabold tracking-[-0.035em]">MyPrintables</span>
      )}
    </Link>
  )
}
