import { Bookmark, Box, Download, Eye, FileBox, FolderPlus, Heart, Pencil, Share2, Star, Trash2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { lazy, Suspense, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ApiError, del, formatBytes, formatDate, post } from '../lib/api'
import { displayCount, fileUrl, getModel, imageUrl, modelUrl, visibilityLabel, type Model, type ModelDetail as Detail } from '../lib/models'
import { getModelCollections, type Collection } from '../lib/social'
import { RatingInput } from '../components/RatingInput'
import { Comments } from '../components/Comments'
import { AddToCollection } from '../components/AddToCollection'

const ModelViewer = lazy(() => import('../components/viewer/ModelViewer'))
const ModelPreview = lazy(() => import('../components/viewer/ModelPreview'))

export function ModelDetail() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const [auth] = useAtom(authAtom)
  const navigate = useNavigate()
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [tab, setTab] = useState<'details' | 'files' | 'comments' | 'collections' | 'related'>('details')
  const [related, setRelated] = useState<Model[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [busy, setBusy] = useState('')
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerFileId, setViewerFileId] = useState('')

  useEffect(() => {
    setDetail(null)
    setError('')
    getModel(id).then((d) => {
      setDetail(d)
      setActiveImage(0)
      fetch(`/api/models/${d.model.id}/related`).then((r) => r.json()).then((x) => setRelated(x.items ?? [])).catch(() => {})
      getModelCollections(d.model.id).then((x) => setCollections(x.items)).catch(() => {})
    }).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load model.'))
  }, [id])

  useEffect(() => {
    if (params.get('viewer') !== '1' || !detail) return
    const list = detail.model.files ?? []
    const first = list.find((f) => f.isPreview) ?? list[0]
    if (first) { setViewerFileId(first.id); setViewerOpen(true) }
  }, [detail, params])

  if (error) return <main className="container-page py-16"><div className="border border-danger/30 bg-danger/5 p-6 text-sm text-danger">{error}</div></main>
  if (!detail) return <main className="container-page py-16 text-sm text-muted">Loading model…</main>

  const m = detail.model
  const images = (m.images ?? []).filter((im) => im.kind === 'upload')
  const files = m.files ?? []
  const preview = files.find((f) => f.isPreview) ?? files[0]
  const canEdit = detail.canEdit
  const isAuthed = !!auth.user
  const csrf = auth.csrf

  async function toggle(kind: 'like' | 'bookmark') {
    if (!isAuthed) { navigate(`/login?next=${encodeURIComponent(location.pathname)}`); return }
    setBusy(kind)
    try {
      const res = await post<{ liked?: boolean; likeCount?: number; bookmarked?: boolean; bookmarkCount?: number }>(`/api/models/${m.id}/${kind}`, {}, csrf)
      setDetail((prev) => prev ? { ...prev, model: { ...prev.model, ...(kind === 'like' ? { liked: res.liked!, likeCount: res.likeCount! } : { bookmarked: res.bookmarked!, bookmarkCount: res.bookmarkCount! }) } } : prev)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update.')
    } finally { setBusy('') }
  }

  async function remove() {
    if (!confirm(`Delete “${m.title}”? This cannot be undone.`)) return
    try {
      await del(`/api/models/${m.id}`, csrf)
      navigate('/models')
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete model.') }
  }

  return (
    <main className="container-page py-8">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <Link to="/models" className="rounded-[2px] border border-line bg-surface px-2 py-1 hover:text-ink">‹ 3D Models</Link>
        {m.categorySlug && <Link to={`/models?category=${m.categorySlug}`} className="rounded-[2px] border border-line bg-surface px-2 py-1 hover:text-ink">‹ {m.categoryName}</Link>}
        {m.tags?.map((t) => <Link key={t.id} to={`/tags/${t.slug}`} className="rounded-[2px] border border-line bg-surface px-2 py-1 hover:text-ink">#{t.name}</Link>)}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <div className="relative overflow-hidden border border-line bg-canvas">
            {images.length > 0 ? (
              <img src={imageUrl(m.id, images[activeImage >= images.length ? 0 : activeImage].id, 'large')} alt={m.title} className="aspect-[4/3] w-full object-contain" />
            ) : preview ? (
              <div className="aspect-[4/3] w-full">
                <Suspense fallback={<div className="flex h-full items-center justify-center bg-canvas text-xs text-muted">Loading 3D preview…</div>}>
                  <ModelPreview model={m} file={preview} onOpen={() => { setViewerFileId(preview.id); setViewerOpen(true) }} />
                </Suspense>
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#fff1ea,#f5f5f5)]"><Box className="h-20 w-20 text-brand/40" strokeWidth={1} /></div>
            )}
            {m.status === 'draft' && <span className="absolute left-3 top-3 z-20 bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Draft</span>}
            <span className="absolute right-3 top-3 z-20 rounded-[2px] bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">{visibilityLabel(m.visibility)}</span>
          </div>
          {(images.length > 0 || preview) && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {images.slice(0, 1).map((im) => (
                <button key={im.id} onClick={() => setActiveImage(0)} className={`shrink-0 border-2 ${activeImage === 0 ? 'border-brand' : 'border-transparent'}`}>
                  <img src={imageUrl(m.id, im.id, 'thumb')} alt="" className="h-20 w-28 object-cover" />
                </button>
              ))}
              {preview && (
                <button
                  type="button"
                  onClick={() => { setViewerFileId(preview.id); setViewerOpen(true) }}
                  className="group relative flex h-20 w-28 shrink-0 flex-col items-center justify-center border-2 border-transparent bg-[radial-gradient(circle_at_50%_30%,#3a2118_0%,#1f2124_62%)] text-white hover:border-brand"
                  aria-label={`Open 3D viewer for ${preview.filename}`}
                  title={`View ${preview.filename} in 3D`}
                >
                  <Box className="h-7 w-7 text-brand transition-transform group-hover:scale-110" />
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/80">View 3D</span>
                  <span className="absolute right-1 top-1 bg-brand px-1 py-0.5 text-[8px] font-bold uppercase text-white">{preview.format}</span>
                </button>
              )}
              {images.slice(1).map((im, i) => (
                <button key={im.id} onClick={() => setActiveImage(i + 1)} className={`shrink-0 border-2 ${activeImage === i + 1 ? 'border-brand' : 'border-transparent'}`}>
                  <img src={imageUrl(m.id, im.id, 'thumb')} alt="" className="h-20 w-28 object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 flex gap-6 overflow-x-auto border-b border-line text-sm font-bold text-muted">
            {([['details', 'Details'], ['files', `Files (${files.length})`], ['comments', `Comments (${m.commentCount})`], ['collections', `Collections (${collections.length})`], ['related', 'Related']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap border-b-2 pb-3 ${tab === key ? 'border-brand text-ink' : 'border-transparent hover:text-ink'}`}>{label}</button>
            ))}
          </div>

          {tab === 'details' && (
            <div className="max-w-[740px] py-6 text-sm leading-6 text-text">
              {m.description ? (
                <div className="prose-printables">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{m.description}</ReactMarkdown>
                </div>
              ) : <p className="text-muted">No description yet.</p>}
              {m.tags && m.tags.length > 0 && (
                <div className="mt-8 border-t border-line pt-5">
                  <h2 className="font-display text-lg font-bold text-ink">Tags</h2>
                  <div className="mt-3 flex flex-wrap gap-2">{m.tags.map((t) => <Link key={t.id} to={`/tags/${t.slug}`} className="border border-line bg-canvas px-2 py-1 text-xs text-text hover:border-line-strong">#{t.name}</Link>)}</div>
                </div>
              )}
              {m.license && <div className="mt-8 border-t border-line pt-5 text-xs"><span className="text-muted">License:</span> <span className="font-semibold text-ink">{m.license}</span></div>}
              {m.sourceUrl && <div className="mt-2 text-xs"><span className="text-muted">Source:</span> <a href={m.sourceUrl} target="_blank" rel="noreferrer" className="text-brand-strong hover:underline">{m.sourceUrl}</a></div>}
            </div>
          )}

          {tab === 'files' && (
            <div className="py-6">
              <div className="border border-line bg-surface">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 border-b border-line px-3 py-3 last:border-0">
                    <FileBox className="h-5 w-5 text-brand" />
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{f.filename}</p><p className="text-[11px] text-muted">{f.format.toUpperCase()} · {formatBytes(f.sizeBytes)}</p></div>
                    {f.isPreview && <span className="text-[10px] font-bold uppercase text-brand-strong">Preview</span>}
                    <button onClick={() => { setViewerFileId(f.id); setViewerOpen(true) }} className="btn-secondary !min-h-8 !px-2 !text-[11px]"><Box className="h-3.5 w-3.5" /> View 3D</button>
                    <a href={fileUrl(m.id, f.id, true)} className="btn-secondary !min-h-8 !px-2 !text-[11px]"><Download className="h-3.5 w-3.5" /> Download</a>
                  </div>
                ))}
                {files.length === 0 && <p className="p-6 text-sm text-muted">No files uploaded yet.</p>}
              </div>
            </div>
          )}

          {tab === 'comments' && <Comments model={m} onCountChange={(delta) => setDetail((prev) => prev ? { ...prev, model: { ...prev.model, commentCount: Math.max(0, prev.model.commentCount + delta) } } : prev)} />}

          {tab === 'collections' && (
            <div className="py-6">
              {collections.length ? collections.map((c) => (
                <Link key={c.id} to={`/collections/${c.id}/${c.slug}`} className="mb-2 flex items-center gap-3 border border-line bg-surface p-3 hover:border-line-strong">
                  <span className="flex h-10 w-10 items-center justify-center bg-canvas"><Box className="h-5 w-5 text-brand" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-ink">{c.name}</span><span className="block text-[11px] text-muted">by {c.ownerName} · {c.modelCount} models</span></span>
                </Link>
              )) : <p className="text-sm text-muted">This model is not in any visible collections yet.</p>}
            </div>
          )}

          {tab === 'related' && (
            <div className="grid gap-4 py-6 sm:grid-cols-2">
              {related.map((r) => <Link key={r.id} to={modelUrl(r)} className="card-line flex gap-3 p-3 hover:border-line-strong">
                {r.coverImageId ? <img src={imageUrl(r.id, r.coverImageId, 'thumb')} alt="" className="h-16 w-20 object-cover" /> : <div className="flex h-16 w-20 items-center justify-center bg-canvas"><Box className="h-6 w-6 text-line-strong" /></div>}
                <div><p className="line-clamp-2 text-sm font-semibold text-ink">{r.title}</p><p className="mt-1 text-[11px] text-muted">{r.ownerName}</p></div>
              </Link>)}
              {related.length === 0 && <p className="text-sm text-muted">No related models.</p>}
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink">{m.title}</h1>
            <span className="shrink-0 text-[11px] text-muted">{formatDate(m.publishedAt)}</span>
          </div>
          <div className="mt-3"><RatingInput model={m} onChange={(summary) => setDetail((prev) => prev ? { ...prev, model: { ...prev.model, ratingAvg: summary.ratingAvg, ratingCount: summary.ratingCount, myRating: summary.myRating } } : prev)} /></div>
          <div className="mt-1 text-xs text-muted">{m.categoryName || 'Uncategorized'}</div>
          <div className="mt-5 flex items-center gap-3 border-y border-line py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">{m.ownerName.slice(0, 1).toUpperCase()}</span>
            <div className="min-w-0"><Link to={`/u/${m.ownerUsername}`} className="block truncate text-sm font-bold text-ink hover:underline">{m.ownerName}</Link><p className="text-[11px] text-muted">@{m.ownerUsername}</p></div>
            {canEdit && <Link to={`/upload?edit=${m.id}`} className="ml-auto flex items-center gap-1 text-xs font-semibold text-brand-strong"><Pencil className="h-3.5 w-3.5" /> Edit</Link>}
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-text">{m.description.replace(/[#*_`>-]/g, '').slice(0, 260) || 'No description yet.'}</p>
          <div className="mt-5 grid gap-2">
            {preview ? (
              <a href={fileUrl(m.id, preview.id, true)} className="btn-primary w-full"><Download className="h-4 w-4" /> Download</a>
            ) : <span className="btn-secondary w-full opacity-60">No file available</span>}
            <button onClick={() => { if (preview) { setViewerFileId(preview.id); setViewerOpen(true) } }} className="btn-secondary w-full" disabled={!preview}><Box className="h-4 w-4" /> View in 3D</button>
            {auth.user && <button onClick={() => setAddOpen(true)} className="btn-secondary w-full"><FolderPlus className="h-4 w-4" /> Add to collection</button>}
          </div>
          <div className="mt-3 grid grid-cols-3 border border-line bg-surface text-xs">
            <button onClick={() => toggle('like')} disabled={busy === 'like'} className={`flex items-center justify-center gap-1 border-r border-line py-3 font-semibold hover:bg-canvas ${m.liked ? 'text-brand-strong' : 'text-text'}`}><Heart className={`h-4 w-4 ${m.liked ? 'fill-current' : ''}`} /> {displayCount(m.likeCount)}</button>
            <button onClick={() => toggle('bookmark')} disabled={busy === 'bookmark'} className={`flex items-center justify-center gap-1 border-r border-line py-3 font-semibold hover:bg-canvas ${m.bookmarked ? 'text-brand-strong' : 'text-text'}`}><Bookmark className={`h-4 w-4 ${m.bookmarked ? 'fill-current' : ''}`} /> Save</button>
            <button onClick={() => navigator.clipboard?.writeText(location.href)} className="flex items-center justify-center gap-1 py-3 font-semibold text-text hover:bg-canvas"><Share2 className="h-4 w-4" /> Share</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {displayCount(m.likeCount)}</span>
            <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {displayCount(m.downloadCount)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {displayCount(m.viewCount)}</span>
            <span className="ml-auto">{files.length} file{files.length === 1 ? '' : 's'} · {m.fileFormats ? m.fileFormats.toUpperCase().split(',').join(', ') : '—'}</span>
          </div>
          {canEdit && (
            <button onClick={remove} className="mt-4 flex items-center gap-1 text-xs font-semibold text-danger hover:underline"><Trash2 className="h-3.5 w-3.5" /> Delete model</button>
          )}
        </aside>
      </div>
      {viewerOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-sm text-muted">Loading 3D viewer…</div>}>
          <ModelViewer model={m} files={files} initialFileId={viewerFileId} onClose={() => setViewerOpen(false)} />
        </Suspense>
      )}
      <AddToCollection modelId={m.id} open={addOpen} onClose={() => setAddOpen(false)} />
    </main>
  )
}
