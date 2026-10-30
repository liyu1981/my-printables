import { Hash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ModelCard } from '../components/ModelCard'
import { api } from '../lib/api'
import type { ModelPage, Tag } from '../lib/models'

export function TagPage() {
  const { slug = '' } = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const [page, setPage] = useState<ModelPage | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([
      api<{ tag: Tag }>(`/api/tags/${slug}`),
      api<ModelPage>(`/api/tags/${slug}/models?perPage=48`),
    ]).then(([t, p]) => { setTag(t.tag); setPage(p) }).catch(() => setError('Tag not found.'))
  }, [slug])
  if (error) return <main className="container-page py-16 text-sm text-muted">{error}</main>
  return (
    <main className="container-page py-10">
      <Link to="/tags" className="text-xs text-muted hover:text-ink">‹ All tags</Link>
      <h1 className="mt-4 flex items-center gap-2 text-3xl font-bold text-ink"><Hash className="h-7 w-7 text-brand" />{tag?.name ?? slug}</h1>
      <p className="mt-1 text-sm text-muted">{page ? `${page.total} model${page.total === 1 ? '' : 's'}` : 'Loading…'}</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(page?.items ?? []).map((m) => <ModelCard key={m.id} model={m} />)}
      </div>
      {page && page.items.length === 0 && <p className="mt-8 text-sm text-muted">No models use this tag yet.</p>}
    </main>
  )
}
