import { FileBox, ImagePlus, Loader2, Trash2, Upload as UploadIcon, X } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ErrorBox } from '../components/Form'
import { ApiError, del, formatBytes, patch, post, type User } from '../lib/api'
import { getCategories, getModel, type Category, type Model } from '../lib/models'

type UploadState = { file: File; progress: number; error?: string }

function uploadWithProgress(url: string, file: File, csrf: string, onProgress: (n: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.withCredentials = true
    xhr.setRequestHeader('X-CSRF-Token', csrf)
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)) }
    xhr.onload = () => {
      let body: any = null
      try { body = JSON.parse(xhr.responseText) } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body)
      else reject(new ApiError(xhr.status, body?.error?.code ?? 'upload_failed', body?.error?.message ?? 'Upload failed.'))
    }
    xhr.onerror = () => reject(new ApiError(0, 'network', 'Upload failed.'))
    const fd = new FormData()
    fd.append('file', file, file.name)
    xhr.send(fd)
  })
}

export function Upload() {
  const [auth] = useAtom(authAtom)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const editId = params.get('edit') ?? ''
  const fileInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Model | null>(null)
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', license: '', sourceUrl: '', visibility: 'public', tags: '' })
  const [files, setFiles] = useState<UploadState[]>([])
  const [images, setImages] = useState<UploadState[]>([])
  const [existingFiles, setExistingFiles] = useState<Model['files']>([])
  const [existingImages, setExistingImages] = useState<Model['images']>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(!!editId)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!editId) return
    getModel(editId).then(({ model, canEdit }) => {
      if (!canEdit) { setError('You cannot edit this model.'); return }
      setEditing(model)
      setForm({
        title: model.title, description: model.description, categoryId: model.categoryId,
        license: model.license, sourceUrl: model.sourceUrl, visibility: model.visibility,
        tags: (model.tags ?? []).map((t) => t.name).join(', '),
      })
      setExistingFiles(model.files ?? [])
      setExistingImages(model.images ?? [])
    }).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load model.')).finally(() => setLoading(false))
  }, [editId])

  async function submit(e: React.FormEvent, publish: boolean) {
    e.preventDefault()
    if (!auth.user) return
    if (form.title.trim().length < 3) { setError('Title must be at least 3 characters.'); return }
    setBusy(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        license: form.license,
        sourceUrl: form.sourceUrl,
        visibility: form.visibility,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 15),
      }
      let model: Model
      if (editing) {
        const res = await patch<{ model: Model }>(`/api/models/${editing.id}`, { ...payload, status: publish ? 'published' : editing.status }, auth.csrf)
        model = res.model
      } else {
        const res = await post<{ model: Model }>('/api/models', { ...payload, status: 'draft' }, auth.csrf)
        model = res.model
      }

      for (let i = 0; i < files.length; i++) {
        setFiles((prev) => prev.map((f, j) => j === i ? { ...f, progress: 0, error: undefined } : f))
        try {
          await uploadWithProgress(`/api/models/${model.id}/files`, files[i].file, auth.csrf, (n) => {
            setFiles((prev) => prev.map((f, j) => j === i ? { ...f, progress: n } : f))
          })
        } catch (err) {
          setFiles((prev) => prev.map((f, j) => j === i ? { ...f, error: err instanceof Error ? err.message : 'Upload failed' } : f))
          throw err
        }
      }
      for (let i = 0; i < images.length; i++) {
        setImages((prev) => prev.map((f, j) => j === i ? { ...f, progress: 0, error: undefined } : f))
        try {
          await uploadWithProgress(`/api/models/${model.id}/images`, images[i].file, auth.csrf, (n) => {
            setImages((prev) => prev.map((f, j) => j === i ? { ...f, progress: n } : f))
          })
        } catch (err) {
          setImages((prev) => prev.map((f, j) => j === i ? { ...f, error: err instanceof Error ? err.message : 'Upload failed' } : f))
          throw err
        }
      }
      if (publish && (!editing || editing.status !== 'published')) {
        await patch(`/api/models/${model.id}`, { status: 'published' }, auth.csrf)
      }
      navigate(`/model/${model.id}/${model.slug}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save the model.')
    } finally {
      setBusy(false)
    }
  }

  async function removeFile(id: string) {
    if (!editing) return
    try { await del(`/api/models/${editing.id}/files/${id}`, auth.csrf); setExistingFiles((f) => (f ?? []).filter((x) => x.id !== id)) }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete file.') }
  }
  async function removeImage(id: string) {
    if (!editing) return
    try { await del(`/api/models/${editing.id}/images/${id}`, auth.csrf); setExistingImages((f) => (f ?? []).filter((x) => x.id !== id)) }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete image.') }
  }

  if (!auth.user) return null

  return (
    <main className="container-page max-w-[1000px] py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink">{editing ? 'Edit model' : 'Upload a model'}</h1>
          <p className="mt-1 text-sm text-muted">{editing ? 'Update details, files, and visibility.' : 'Add files, a cover, and the details people need.'}</p>
        </div>
        {editing && <span className={`px-2 py-1 text-[11px] font-bold uppercase ${editing.status === 'published' ? 'bg-success/15 text-ink' : 'bg-warning/20 text-ink'}`}>{editing.status}</span>}
      </div>
      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}
      {loading ? <p className="mt-8 text-sm text-muted">Loading…</p> : (
        <form className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" onSubmit={(e) => submit(e, false)}>
          <div className="space-y-6">
            <section className="card-line p-5">
              <h2 className="font-display text-lg font-bold text-ink">Details</h2>
              <div className="mt-4 space-y-4">
                <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Title</span><input className="input-line" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Parametric cable holder" required /></label>
                <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Description</span><textarea className="input-line min-h-40 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Markdown supported. Describe the model, print settings, and what makes it useful." /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">Category</span><select className="input-line" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="">Uncategorized</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                  <label className="block"><span className="mb-2 block text-[13px] font-bold text-ink">License</span><input className="input-line" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="e.g. CC BY-NC 4.0" /></label>
                  <label className="block sm:col-span-2"><span className="mb-2 block text-[13px] font-bold text-ink">Tags <span className="font-normal text-muted">(comma separated, max 15)</span></span><input className="input-line" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="organizer, desk, workshop" /></label>
                  <label className="block sm:col-span-2"><span className="mb-2 block text-[13px] font-bold text-ink">Source URL</span><input className="input-line" type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://… (optional)" /></label>
                </div>
              </div>
            </section>

            <section className="card-line p-5">
              <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold text-ink">3D files</h2><span className="text-[11px] text-muted">STL · 3MF · OBJ · PLY · GLB · GLTF</span></div>
              <button type="button" onClick={() => fileInput.current?.click()} className="mt-4 flex w-full flex-col items-center border border-dashed border-line bg-canvas px-4 py-8 text-center hover:border-brand">
                <UploadIcon className="h-7 w-7 text-brand" /><span className="mt-2 text-sm font-semibold text-ink">Choose model files</span><span className="mt-1 text-[11px] text-muted">STEP/STP is not supported in v1.</span>
              </button>
              <input ref={fileInput} type="file" multiple accept=".stl,.3mf,.obj,.ply,.glb,.gltf" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((file) => ({ file, progress: 0 })))} />
              {(existingFiles ?? []).map((f) => (
                <div key={f.id} className="mt-3 flex items-center gap-3 border border-line px-3 py-2"><FileBox className="h-4 w-4 text-brand" /><span className="min-w-0 flex-1 truncate text-xs">{f.filename}</span><span className="text-[10px] text-muted">{formatBytes(f.sizeBytes)}</span><button type="button" onClick={() => removeFile(f.id)} className="text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button></div>
              ))}
              {files.map((f, i) => (
                <div key={`${f.file.name}-${i}`} className="mt-2 border border-line px-3 py-2 text-xs">
                  <div className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate">{f.file.name}</span><span className="text-muted">{formatBytes(f.file.size)}</span><button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-muted hover:text-danger"><X className="h-4 w-4" /></button></div>
                  {f.progress > 0 && <div className="mt-1 h-1 bg-canvas"><div className="h-1 bg-brand" style={{ width: `${f.progress}%` }} /></div>}
                  {f.error && <p className="mt-1 text-danger">{f.error}</p>}
                </div>
              ))}
            </section>

            <section className="card-line p-5">
              <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold text-ink">Images</h2><span className="text-[11px] text-muted">JPEG · PNG · WebP</span></div>
              <button type="button" onClick={() => imageInput.current?.click()} className="mt-4 flex w-full flex-col items-center border border-dashed border-line bg-canvas px-4 py-6 text-center hover:border-brand"><ImagePlus className="h-6 w-6 text-brand" /><span className="mt-2 text-xs font-semibold text-ink">Add photos or render</span></button>
              <input ref={imageInput} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setImages(Array.from(e.target.files ?? []).map((file) => ({ file, progress: 0 })))} />
              <div className="mt-3 flex flex-wrap gap-2">
                {(existingImages ?? []).map((im) => (
                  <div key={im.id} className="relative"><img src={`/api/models/${editing?.id}/images/${im.id}/thumb`} alt="" className="h-20 w-24 object-cover" /><button type="button" onClick={() => removeImage(im.id)} className="absolute right-1 top-1 bg-ink/80 p-1 text-white"><Trash2 className="h-3 w-3" /></button></div>
                ))}
                {images.map((im, i) => (
                  <div key={`${im.file.name}-${i}`} className="relative border border-line p-1"><img src={URL.createObjectURL(im.file)} alt="" className="h-20 w-24 object-cover" /><button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className="absolute right-1 top-1 bg-ink/80 p-1 text-white"><X className="h-3 w-3" /></button>{im.progress > 0 && <div className="absolute bottom-1 left-1 right-1 h-1 bg-canvas"><div className="h-1 bg-brand" style={{ width: `${im.progress}%` }} /></div>}</div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="card-line p-4">
              <h2 className="font-display text-base font-bold text-ink">Visibility</h2>
              <div className="mt-3 space-y-2">
                {[['public', 'Public', 'Anyone can view and download.'], ['members', 'Members only', 'Only signed-in users.'], ['private', 'Private', 'Only you and admins.']].map(([value, label, note]) => (
                  <label key={value} className={`flex cursor-pointer gap-2 border p-2.5 ${form.visibility === value ? 'border-brand bg-brand-soft/60' : 'border-line'}`}><input type="radio" name="visibility" value={value} checked={form.visibility === value} onChange={() => setForm({ ...form, visibility: value })} className="mt-0.5 accent-brand" /><span><span className="block text-xs font-semibold text-ink">{label}</span><span className="block text-[10px] text-muted">{note}</span></span></label>
                ))}
              </div>
            </div>
            <div className="card-line p-4 text-xs leading-5 text-muted">
              Files are stored in the configured data directory. Images are re-encoded and resized automatically.
            </div>
            <button type="submit" className="btn-secondary w-full" disabled={busy}>{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : 'Save draft'}</button>
            <button type="button" className="btn-primary w-full" disabled={busy} onClick={(e) => submit(e, true)}>{busy ? 'Uploading…' : 'Publish model'}</button>
          </aside>
        </form>
      )}
    </main>
  )
}
