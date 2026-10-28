import { Folder, Lock, Pencil, Trash2, Users } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ModelCard } from '../components/ModelCard'
import { ErrorBox, SuccessBox } from '../components/Form'
import { ApiError } from '../lib/api'
import { visibilityLabel } from '../lib/models'
import type { CollectionDetail as Detail } from '../lib/social'
import { deleteCollection, getCollection, removeFromCollection, updateCollection } from '../lib/social'

export function CollectionDetail() {
  const { id = '' } = useParams()
  const [auth] = useAtom(authAtom)
  const navigate = useNavigate()
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', visibility: 'public' })
  const [busy, setBusy] = useState(false)

  function load() {
    getCollection(id).then((d) => {
      setDetail(d)
      setForm({ name: d.collection.name, description: d.collection.description, visibility: d.collection.visibility })
    }).catch((err) => setError(err instanceof ApiError ? err.message : 'Collection not found.'))
  }
  useEffect(load, [id])

  if (error && !detail) return <main className="container-page py-16 text-sm text-muted">{error}</main>
  if (!detail) return <main className="container-page py-16 text-sm text-muted">Loading collection…</main>
  const c = detail.collection

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMsg('')
    try { await updateCollection(c.id, form, auth.csrf); setEditing(false); setMsg('Collection updated.'); load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not update collection.') }
    finally { setBusy(false) }
  }
  async function remove() {
    if (!confirm(`Delete “${c.name}”?`)) return
    try { await deleteCollection(c.id, auth.csrf); navigate('/collections') }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete collection.') }
  }
  async function removeModel(modelId: string) {
    try { await removeFromCollection(c.id, modelId, auth.csrf); load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not remove model.') }
  }

  return (
    <main className="container-page py-10">
      <Link to="/collections" className="text-xs text-muted hover:text-ink">‹ Collections</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-8">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-canvas"><Folder className="h-7 w-7 text-brand" /></span>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-ink">{c.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted"><span>by <Link to={`/u/${c.ownerUsername}`} className="font-semibold text-ink hover:underline">{c.ownerName}</Link></span><span>·</span><span>{c.modelCount} models</span><span>·</span><span className="flex items-center gap-1">{c.visibility === 'private' ? <Lock className="h-3 w-3" /> : c.visibility === 'members' ? <Users className="h-3 w-3" /> : null}{visibilityLabel(c.visibility)}</span></p>
            {c.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-text">{c.description}</p>}
          </div>
        </div>
        {detail.canEdit && <div className="flex gap-2"><button className="btn-secondary !min-h-9" onClick={() => setEditing((v) => !v)}><Pencil className="h-4 w-4" /> Edit</button><button className="btn-secondary !min-h-9 !border-danger/40 !text-danger" onClick={remove}><Trash2 className="h-4 w-4" /> Delete</button></div>}
      </div>
      {(error || msg) && <div className="mt-4 space-y-2"><ErrorBox>{error}</ErrorBox><SuccessBox>{msg}</SuccessBox></div>}
      {editing && (
        <form onSubmit={save} className="mt-5 grid gap-4 border border-line bg-surface p-5 md:grid-cols-2">
          <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Name</span><input className="input-line" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Visibility</span><select className="input-line" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}><option value="public">Public</option><option value="members">Members only</option><option value="private">Private</option></select></label>
          <label className="block md:col-span-2"><span className="mb-2 block text-[13px] font-bold text-ink">Description</span><textarea className="input-line min-h-20 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="flex justify-end md:col-span-2"><button className="btn-primary" disabled={busy}>Save changes</button></div>
        </form>
      )}
      {detail.models.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {detail.models.map((m) => <div key={m.id} className="relative"><ModelCard model={m} />{detail.canEdit && <button onClick={() => removeModel(m.id)} className="absolute right-2 top-10 z-10 bg-ink/80 px-2 py-1 text-[10px] font-semibold text-white hover:bg-danger">Remove</button>}</div>)}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-line bg-surface p-12 text-center"><p className="font-display text-lg font-bold text-ink">This collection is empty</p><p className="mt-1 text-sm text-muted">Add models from their detail pages.</p></div>
      )}
    </main>
  )
}
