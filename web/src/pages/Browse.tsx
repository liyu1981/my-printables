import { Box, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ModelCard } from '../components/ModelCard'
import { getCategories, getModels, getTags, type Category, type ModelPage, type Tag } from '../lib/models'

const sorts = [
  ['trending', 'Trending'],
  ['newest', 'New uploads'],
  ['downloads', 'Downloads'],
  ['likes', 'Likes'],
  ['rating', 'Rating'],
]
const formats = ['stl', '3mf', 'obj', 'ply', 'glb', 'gltf', 'gcode', 'step']

export function Browse() {
  const [params, setParams] = useSearchParams()
  const [page, setPage] = useState<ModelPage | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const tag = params.get('tag') ?? ''
  const fileType = params.get('fileType') ?? ''
  const sort = params.get('sort') ?? 'trending'
  const pageNo = Math.max(1, Number(params.get('page') ?? '1'))

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getTags().then(setTags).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams()
    if (q) query.set('q', q)
    if (category) query.set('category', category)
    if (tag) query.set('tag', tag)
    if (fileType) query.set('fileType', fileType)
    query.set('sort', sort)
    query.set('page', String(pageNo))
    query.set('perPage', '24')
    getModels(query.toString()).then(setPage).catch(() => setPage({ items: [], page: 1, perPage: 24, total: 0, totalPages: 0 })).finally(() => setLoading(false))
  }, [q, category, tag, fileType, sort, pageNo])

  function set(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  const activeFilters = [
    q && { key: 'q', label: `Search: ${q}` },
    category && { key: 'category', label: categories.find((c) => c.slug === category)?.name ?? category },
    tag && { key: 'tag', label: `#${tag}` },
    fileType && { key: 'fileType', label: fileType.toUpperCase() },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <main className="container-page py-8">
      <div className="mb-6 flex items-center gap-2 text-xs text-muted">
        <span className="rounded-[2px] border border-line bg-surface px-2 py-1">‹ 3D Models</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">3D Models</h1>
          <p className="mt-1 text-sm text-muted">{page ? `${page.total} model${page.total === 1 ? '' : 's'}` : 'Loading…'}</p>
        </div>
        <Link to="/upload" className="btn-primary">Upload model</Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="card-line h-fit p-4">
          <div className="flex items-center gap-2 border-b border-line pb-3 text-sm font-bold text-ink"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Categories</p>
            <div className="mt-2 space-y-1">
              <button onClick={() => set('category', '')} className={`block w-full px-2 py-1.5 text-left text-sm ${!category ? 'bg-brand-soft font-semibold text-brand-strong' : 'text-text hover:bg-canvas'}`}>All categories</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => set('category', c.slug)} className={`flex w-full items-center justify-between px-2 py-1.5 text-left text-sm ${category === c.slug ? 'bg-brand-soft font-semibold text-brand-strong' : 'text-text hover:bg-canvas'}`}>
                  <span className="truncate">{c.name}</span><span className="text-[11px] text-muted">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">File types</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <label key={f} className="flex items-center gap-2 text-xs text-text">
                  <input type="checkbox" checked={fileType === f} onChange={(e) => set('fileType', e.target.checked ? f : '')} className="h-4 w-4 accent-brand" />
                  {f.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
          {tags.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Popular tags</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.filter((t) => (t.count ?? 0) > 0).slice(0, 12).map((t) => (
                  <button key={t.id} onClick={() => set('tag', t.slug)} className={`border px-2 py-1 text-[11px] ${tag === t.slug ? 'border-brand bg-brand-soft text-brand-strong' : 'border-line text-text hover:border-line-strong'}`}>#{t.name}</button>
                ))}
              </div>
            </div>
          )}
          {activeFilters.length > 0 && (
            <button onClick={() => setParams(new URLSearchParams())} className="mt-5 w-full border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-ink">Clear all filters</button>
          )}
        </aside>

        <div>
          <div className="flex gap-4 overflow-x-auto border-b border-line pb-0 text-sm font-bold text-muted">
            {sorts.map(([value, label]) => (
              <button key={value} onClick={() => set('sort', value)} className={`whitespace-nowrap border-b-2 pb-3 ${sort === value ? 'border-brand text-ink' : 'border-transparent hover:text-ink'}`}>{label}</button>
            ))}
          </div>
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <button key={f.key} onClick={() => set(f.key, '')} className="border border-line bg-surface px-2 py-1 text-[11px] text-text hover:border-line-strong">{f.label} ×</button>
              ))}
            </div>
          )}
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-line h-[340px] animate-pulse bg-canvas" />)}</div>
          ) : page && page.items.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{page.items.map((m) => <ModelCard key={m.id} model={m} />)}</div>
              {page.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3 text-sm">
                  <button className="btn-secondary !min-h-9" disabled={pageNo <= 1} onClick={() => set('page', String(pageNo - 1))}><ChevronLeft className="h-4 w-4" /> Prev</button>
                  <span className="text-muted">Page {pageNo} of {page.totalPages}</span>
                  <button className="btn-secondary !min-h-9" disabled={pageNo >= page.totalPages} onClick={() => set('page', String(pageNo + 1))}>Next <ChevronRight className="h-4 w-4" /></button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center border border-dashed border-line bg-surface p-8 text-center">
              <Box className="h-10 w-10 text-line-strong" />
              <h2 className="mt-4 font-display text-lg font-bold text-ink">No models match these filters</h2>
              <p className="mt-1 text-sm text-muted">Try clearing the search or uploading a model.</p>
              <button onClick={() => setParams(new URLSearchParams())} className="btn-secondary mt-5">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
