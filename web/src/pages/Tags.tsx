import { Hash, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getTags, type Tag } from '../lib/models'

export function Tags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => { getTags().then(setTags).catch(() => {}).finally(() => setLoading(false)) }, [])
  const filtered = tags.filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.slug.includes(q.toLowerCase()))
  return (
    <main className="container-page max-w-[1000px] py-10">
      <h1 className="text-3xl font-bold text-ink">Tags</h1>
      <p className="mt-1 text-sm text-muted">Browse the library by topic.</p>
      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter tags" className="input-line pl-9" />
      </div>
      {loading ? <p className="mt-8 text-sm text-muted">Loading…</p> : (
        <div className="mt-6 flex flex-wrap gap-2">
          {filtered.map((t) => <Link key={t.id} to={`/tags/${t.slug}`} className="flex items-center gap-1.5 border border-line bg-surface px-3 py-2 text-sm text-text hover:border-line-strong"><Hash className="h-3.5 w-3.5 text-brand" /> {t.name}<span className="text-[10px] text-muted">{t.count}</span></Link>)}
          {filtered.length === 0 && <p className="text-sm text-muted">No tags found.</p>}
        </div>
      )}
    </main>
  )
}
