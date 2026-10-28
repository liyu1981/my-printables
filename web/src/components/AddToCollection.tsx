import { Check, FolderPlus, Loader2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { authAtom } from '../atoms/auth'
import { ApiError } from '../lib/api'
import { addToCollection, createCollection, getModelCollections, getMyCollections, removeFromCollection, type Collection } from '../lib/social'

export function AddToCollection({ modelId, open, onClose }: { modelId: string; open: boolean; onClose: () => void }) {
  const [auth] = useAtom(authAtom)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !auth.user) return
    Promise.all([getMyCollections(auth.user.username), getModelCollections(modelId)]).then(([mine, current]) => {
      setCollections(mine.items)
      setSelected(new Set(current.items.map((c) => c.id)))
    }).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load collections.'))
  }, [open, auth.user?.username, modelId])

  if (!open || !auth.user) return null

  async function toggle(c: Collection) {
    setBusy(c.id); setError('')
    try {
      if (selected.has(c.id)) {
        await removeFromCollection(c.id, modelId, auth.csrf)
        setSelected((prev) => { const n = new Set(prev); n.delete(c.id); return n })
      } else {
        await addToCollection(c.id, modelId, auth.csrf)
        setSelected((prev) => new Set(prev).add(c.id))
      }
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Could not update collection.') }
    finally { setBusy('') }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy('create'); setError('')
    try {
      const res = await createCollection({ name, description: '', visibility: 'public' }, auth.csrf)
      await addToCollection(res.collection.id, modelId, auth.csrf)
      setCollections((prev) => [{ ...res.collection, covers: [] }, ...prev])
      setSelected((prev) => new Set(prev).add(res.collection.id))
      setName(''); setShowCreate(false)
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Could not create collection.') }
    finally { setBusy('') }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md border border-line bg-surface p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl font-bold text-ink">Add to collection</h2>
        {error && <p className="mt-2 border border-danger/30 bg-danger/5 px-2 py-1 text-xs text-danger">{error}</p>}
        <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
          {collections.map((c) => (
            <button key={c.id} onClick={() => toggle(c)} disabled={busy === c.id} className="flex w-full items-center gap-3 border border-line px-3 py-2.5 text-left text-sm hover:bg-canvas">
              <span className={`flex h-5 w-5 items-center justify-center border ${selected.has(c.id) ? 'border-brand bg-brand text-white' : 'border-line'}`}>{selected.has(c.id) && <Check className="h-3.5 w-3.5" />}</span>
              <span className="min-w-0 flex-1 truncate font-medium text-ink">{c.name}</span>
              <span className="text-[10px] text-muted">{c.modelCount}</span>
            </button>
          ))}
          {collections.length === 0 && !showCreate && <p className="py-4 text-center text-sm text-muted">No collections yet.</p>}
        </div>
        {showCreate ? (
          <form onSubmit={create} className="mt-3 flex gap-2 border-t border-line pt-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name" className="input-line" autoFocus />
            <button className="btn-primary !min-h-9" disabled={busy === 'create'}>{busy === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}</button>
          </form>
        ) : (
          <button onClick={() => setShowCreate(true)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-strong hover:underline"><FolderPlus className="h-4 w-4" /> Create new collection</button>
        )}
        <div className="mt-5 flex justify-end border-t border-line pt-3"><button className="btn-secondary" onClick={onClose}>Done</button></div>
      </div>
    </div>
  )
}
