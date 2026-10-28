import { Box, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router'

export function Browse() {
  return (
    <main className="container-page py-8">
      <div className="mb-6 flex items-center gap-2 text-xs text-muted">
        <span className="rounded-[2px] border border-line bg-surface px-2 py-1">‹ 3D Models</span>
      </div>
      <h1 className="text-3xl font-bold text-ink">3D Models</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="card-line h-fit p-4">
          <div className="flex items-center gap-2 border-b border-line pb-3 text-sm font-bold text-ink">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </div>
          <p className="mt-3 text-xs text-muted">Category, tags, file type, and visibility filters will appear here.</p>
        </aside>
        <div>
          <div className="flex flex-wrap gap-4 border-b border-line pb-3 text-sm font-bold text-muted">
            <span className="border-b-2 border-brand pb-3 text-ink">Trending</span>
            <span>New uploads</span>
            <span>Downloads</span>
            <span>Likes</span>
          </div>
          <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center border border-dashed border-line bg-surface p-8 text-center">
            <Box className="h-10 w-10 text-line-strong" />
            <h2 className="mt-4 font-display text-lg font-bold text-ink">Your library starts empty</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">Upload your first model to see it here.</p>
            <Link to="/upload" className="btn-primary mt-5">Upload a model</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
