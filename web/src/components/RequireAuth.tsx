import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { authAtom } from '../atoms/auth'

export function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const [auth] = useAtom(authAtom)
  const location = useLocation()
  if (!auth.loaded) {
    return <div className="container-page py-16 text-sm text-muted">Loading…</div>
  }
  if (!auth.user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  if (admin && auth.user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
