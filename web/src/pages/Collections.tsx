import { FolderPlus, Loader2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { authAtom } from '../atoms/auth'
import { CollectionCard } from '../components/CollectionCard'
import { ErrorBox } from '../components/Form'
import { ApiError } from '../lib/api'
import { createCollection, getCollections, getMyCollections, type Collection } from '../lib/social'

export function Collections() {
  const [auth] = useAtom(authAtom)
  const [tab, setTab] = useState<'discover' | 'mine'>('discover')
  const [items, setItems] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', visibility: 'public' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    setLoading(true)
    const p = tab === 'mine' && auth.user ? getMyCollections(auth.user.username) : getCollections()
    p.then((r) => setItems(r.items)).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load collections.')).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [tab, auth.user?.username])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!auth.user) return
    setBusy(true); setError('')
    try {
      await createCollection(form, auth.csrf)
      setForm({ name: '', description: '', visibility: 'public' })
      setShowCreate(false)
      setTab('mine')
      load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create collection.')
    } finally { setBusy(false) }
  }

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">Collections</h1>
          <p className="mt-1 text-sm text-muted">Group models into focused sets for projects, printers, or ideas.</p>
        </div>
        {auth.user && <button onClick={() => setShowCreate(true)} className="btn-primary"><FolderPlus className="h-4 w-4" /> New collection</button>}
      </div>
      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}
      {auth.user && (
        <div className="mt-6 flex gap-5 border-b border-line text-sm font-bold text-muted">
          <button onClick={() => setTab('discover')} className={`border-b-2 pb-3 ${tab === 'discover' ? 'border-brand text-ink' : 'border-transparent'}`}>Discover</button>
          <button onClick={() => setTab('mine')} className={`border-b-2 pb-3 ${tab === 'mine' ? 'border-brand text-ink' : 'border-transparent'}`}>Mine</button>
        </div>
      )}
      {loading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="card-line h-[280px] animate-pulse bg-canvas" />)}</div>
      ) : items.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((c) => <CollectionCard key={c.id} collection={c} />)}</div>
      ) : (
        <div className="mt-6 flex flex-col items-center border border-dashed border-line bg-surface p-12 text-center">
          <FolderPlus className="h-10 w-10 text-line-strong" />
          <h2 className="mt-3 font-display text-lg font-bold text-ink">{tab === 'mine' ? 'You have no collections yet' : 'No public collections yet'}</h2>
          <p className="mt-1 text-sm text-muted">Create a collection and add models from their detail pages.</p>
          {auth.user && <button onClick={() => setShowCreate(true)} className="btn-secondary mt-5">Create a collection</button>}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md border border-line bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-ink">New collection</h2>
            <form onSubmit={create} className="mt-4 space-y-4">
              <ErrorBox>{error}</ErrorBox>
              <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Name</span><input className="input-line" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus /></label>
              <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Description</span><textarea className="input-line min-h-20 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Visibility</span><select className="input-line" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}><option value="public">Public</option><option value="members">Members only</option><option value="private">Private</option></select></label>
              <div className="flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
