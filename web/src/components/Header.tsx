import { Search, Upload, User, Menu, X, Shield, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAtom } from 'jotai'
import { Link, NavLink, useNavigate } from 'react-router'
import { cn } from '../lib/cn'
import { authAtom } from '../atoms/auth'
import { post } from '../lib/api'
import { Logo } from './Logo'

const nav = [
  { to: '/models', label: '3D Models' },
  { to: '/collections', label: 'Collections' },
  { to: '/tags', label: 'Tags' },
]

export function Header() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [auth, setAuth] = useAtom(authAtom)
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/models${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="hidden h-10 border-b border-line bg-canvas md:block">
        <div className="container-page flex h-full items-center justify-between gap-6">
          <div className="w-40 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            Self-hosted library
          </div>
          <form onSubmit={submit} className="relative w-full max-w-[560px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models, tags, creators"
              className="h-10 w-full rounded-[2px] border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
            />
          </form>
          <div className="flex w-40 items-center justify-end gap-2">
            <Link to="/upload" className="rounded-[2px] p-2 text-ink hover:bg-brand-soft" aria-label="Upload">
              <Upload className="h-5 w-5" />
            </Link>
            <span className="h-5 w-px bg-line" />
            {auth.user ? (
              <span className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-ink">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-strong">
                  {auth.user.displayName.slice(0, 1).toUpperCase()}
                </span>
                {auth.user.displayName}
              </span>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-ink">
                <User className="h-5 w-5" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-16 items-center px-3 text-sm font-semibold text-text transition-colors hover:text-ink',
                      isActive && 'text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {auth.user?.role === 'admin' && (
              <Link to="/admin" className="hidden items-center gap-1.5 rounded-[2px] px-2 py-2 text-sm font-medium text-muted hover:text-ink lg:flex">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            {auth.user ? (
              <Link to="/settings" className="hidden rounded-[2px] p-2 text-muted hover:text-ink sm:block" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </Link>
            ) : null}
            <Link to="/upload" className="btn-outline hidden sm:inline-flex">
              + Create
            </Link>
            {auth.user && (
              <button
                type="button"
                onClick={async () => {
                  try { await post('/api/auth/logout', {}, auth.csrf) } catch { /* ignore */ }
                  setAuth((prev) => ({ ...prev, user: null, csrf: '' }))
                  navigate('/')
                }}
                className="hidden rounded-[2px] p-2 text-muted hover:text-ink sm:block"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-[2px] p-2 text-ink md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-line bg-surface md:hidden">
            <nav className="container-page flex flex-col py-2">
              {[
                ...nav,
                { to: '/upload', label: 'Upload' },
                ...(auth.user ? [{ to: '/settings', label: 'Settings' }] : [{ to: '/login', label: 'Login' }]),
                ...(auth.user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/70 py-3 text-sm font-semibold text-ink last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              {auth.user && (
                <button
                  type="button"
                  onClick={async () => {
                    try { await post('/api/auth/logout', {}, auth.csrf) } catch { /* ignore */ }
                    setAuth((prev) => ({ ...prev, user: null, csrf: '' }))
                    setOpen(false)
                    navigate('/')
                  }}
                  className="py-3 text-left text-sm font-semibold text-danger"
                >
                  Log out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
