import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Logo } from './Logo'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="container-page flex min-h-[calc(100dvh-160px)] items-center justify-center py-12">
      <div className="w-full max-w-[420px] border border-line bg-surface p-7 md:p-8">
        <div className="mb-7 flex justify-center"><Logo /></div>
        <h1 className="text-center font-display text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-sm leading-6 text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-5 border-t border-line pt-4 text-center text-xs text-muted">{footer}</div>}
      </div>
    </main>
  )
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="font-semibold text-brand-strong hover:underline">{children}</Link>
}
