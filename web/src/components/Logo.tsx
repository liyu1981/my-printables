import { useAtom } from 'jotai'
import { Link } from 'react-router'
import { authAtom } from '../atoms/auth'

export function Logo({ compact = false }: { compact?: boolean }) {
  const [auth] = useAtom(authAtom)
  const name = auth.settings.siteName || 'MyPrintables'
  return (
    <Link to="/" className="flex items-center gap-2.5 text-ink" aria-label={`${name} home`}>
      <img src="/brand/cube-mark.svg" alt="" className="h-7 w-7 shrink-0" />
      {!compact && (
        <span className="font-display text-[22px] font-extrabold tracking-[-0.035em]">{name}</span>
      )}
    </Link>
  )
}
