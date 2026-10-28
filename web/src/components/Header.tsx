import { Search, User, Menu, X, Shield, LogOut } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [auth, setAuth] = useAtom(authAtom)
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/models${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
    setMenuOpen(false)
    setSearchOpen(false)
  }

  function searchForm(autoFocus = false, className = '') {
    return (
      <form onSubmit={submit} className={cn('relative w-full', className)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models, tags, creators"
          autoFocus={autoFocus}
          className="h-10 w-full rounded-[2px] border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
        />
      </form>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="border-b border-line">
        <div className="container-page flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[1fr_clamp(0px,30vw,500px)_1fr]">
          <div className="flex min-w-0 items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-0.5 min-[1400px]:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-16 items-center px-2 text-sm font-semibold text-text transition-colors hover:text-ink',
                      isActive && 'text-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-ink',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {searchForm(false, 'hidden md:block')}

          <div className="flex items-center justify-end gap-1.5">
            {auth.user?.role === 'admin' && (
              <Link to="/admin" className="hidden items-center gap-1.5 rounded-[2px] px-2 py-2 text-sm font-medium text-muted hover:text-ink min-[1400px]:flex">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            {auth.user && (
              <Link
                to="/settings"
                className="flex min-w-0 items-center gap-2 rounded-[2px] px-1.5 py-1 text-ink hover:bg-canvas"
                aria-label={`Signed in as ${auth.user.displayName}. Account settings`}
                title={`@${auth.user.username}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-bold text-brand-strong">
                  {auth.user.displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[130px] truncate text-sm font-medium text-ink lg:inline">
                  {auth.user.displayName}
                </span>
              </Link>
            )}
            <Link to="/upload" className="btn-outline hidden sm:inline-flex">
              + Create
            </Link>
            {auth.user ? (
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
            ) : (
              <Link to="/login" className="hidden items-center gap-1.5 px-2 py-1 text-sm font-medium text-ink sm:flex">
                <User className="h-5 w-5" /> Login
              </Link>
            )}
            <button
              type="button"
              onClick={() => { setSearchOpen((v) => !v); setMenuOpen(false) }}
              className="rounded-[2px] p-2 text-ink md:hidden"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen((v) => !v); setSearchOpen(false) }}
              className="rounded-[2px] p-2 text-ink min-[1400px]:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line bg-surface md:hidden">
            <div className="container-page py-2">{searchForm(true)}</div>
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-line bg-surface min-[1400px]:hidden">
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
                  onClick={() => setMenuOpen(false)}
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
                    setMenuOpen(false)
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
