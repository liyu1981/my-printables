import { Box } from 'lucide-react'
import { Link } from 'react-router'

export function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <main className="container-page py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center border border-line bg-surface px-6 py-16 text-center">
        <Box className="h-12 w-12 text-line-strong" />
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{note ?? 'This part of the library is being built.'}</p>
        <Link to="/" className="btn-secondary mt-6">Back home</Link>
      </div>
    </main>
  )
}
