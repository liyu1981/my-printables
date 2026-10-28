import { useAtom } from 'jotai'
import { Link } from 'react-router'
import { authAtom } from '../atoms/auth'
import { Logo } from './Logo'

export function Footer() {
  const [auth] = useAtom(authAtom)
  const settings = auth.settings
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-[220px] text-xs leading-5 text-muted">
            {settings.footerText || 'A self-hosted 3D model library for your home. Your files, your rules.'}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-text">
            <Link to="/models">3D Models</Link>
            <Link to="/collections">Collections</Link>
            <Link to="/tags">Tags</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink">Account</p>
          <div className="flex flex-col gap-2 text-sm text-text">
            <Link to="/upload">Upload</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/login">Log in</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-ink">About</p>
          <div className="flex flex-col gap-2 text-sm text-text">
            <span>Single binary</span>
            <span>SQLite + local files</span>
            <span className="text-muted">v{settings.version}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 text-[11px] text-muted">
          <span>{settings.siteName} · self-hosted</span>
          <span>Built for a home NAS</span>
        </div>
      </div>
    </footer>
  )
}
