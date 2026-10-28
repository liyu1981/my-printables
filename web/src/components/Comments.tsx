import { MessageSquare, Pencil, Reply, Trash2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ApiError } from '../lib/api'
import type { Model } from '../lib/models'
import { deleteComment, getComments, postComment, timeAgo, updateComment, type Comment, type CommentPage } from '../lib/social'

export function Comments({ model }: { model: Model }) {
  const [auth] = useAtom(authAtom)
  const [page, setPage] = useState<CommentPage | null>(null)
  const [sort, setSort] = useState<'new' | 'old'>('new')
  const [pageNo, setPageNo] = useState(1)
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    getComments(model.id, pageNo, sort).then(setPage).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load comments.'))
  }
  useEffect(() => { load() }, [model.id, pageNo, sort])

  const user = auth.user
  const canModerate = user && (user.id === model.ownerId || user.role === 'admin')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !body.trim()) return
    setBusy(true); setError('')
    try {
      await postComment(model.id, body, auth.csrf, replyTo?.id)
      setBody(''); setReplyTo(null); setPageNo(1); load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not post comment.')
    } finally { setBusy(false) }
  }

  async function saveEdit(id: string) {
    if (!editBody.trim()) return
    setBusy(true); setError('')
    try {
      await updateComment(id, editBody, auth.csrf)
      setEditing(null); setEditBody(''); load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update comment.')
    } finally { setBusy(false) }
  }

  async function remove(id: string) {
    if (!confirm('Delete this comment?')) return
    setBusy(true); setError('')
    try {
      await deleteComment(id, auth.csrf)
      load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete comment.')
    } finally { setBusy(false) }
  }

  function renderComment(c: Comment, isReply = false) {
    const own = user?.id === c.userId
    return (
      <div key={c.id} className={isReply ? 'ml-8 mt-4 border-l border-line pl-4' : 'mt-5'}>
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-strong">{c.displayName.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 text-xs">
              <span className="font-semibold text-ink">{c.displayName}</span>
              <span className="text-muted">@{c.username}</span>
              <span className="text-muted">· {timeAgo(c.createdAt)}</span>
              {c.updatedAt > c.createdAt && <span className="text-muted">· edited</span>}
            </div>
            {editing === c.id ? (
              <div className="mt-2">
                <textarea className="input-line min-h-20 py-2" value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                <div className="mt-2 flex gap-2"><button className="btn-secondary !min-h-8 !px-2 !text-[11px]" onClick={() => saveEdit(c.id)} disabled={busy}>Save</button><button className="btn-secondary !min-h-8 !px-2 !text-[11px]" onClick={() => setEditing(null)}>Cancel</button></div>
              </div>
            ) : (
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-text">{c.deleted ? <span className="italic text-muted">[deleted]</span> : c.body}</p>
            )}
            {!c.deleted && (
              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
                {!isReply && user && <button onClick={() => { setReplyTo(c); document.getElementById('comment-composer')?.focus() }} className="flex items-center gap-1 hover:text-ink"><Reply className="h-3 w-3" /> Reply</button>}
                {own && <button onClick={() => { setEditing(c.id); setEditBody(c.body) }} className="flex items-center gap-1 hover:text-ink"><Pencil className="h-3 w-3" /> Edit</button>}
                {(own || canModerate) && <button onClick={() => remove(c.id)} className="flex items-center gap-1 hover:text-danger"><Trash2 className="h-3 w-3" /> Delete</button>}
              </div>
            )}
          </div>
        </div>
        {c.replies?.map((r) => renderComment(r, true))}
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink"><MessageSquare className="h-5 w-5 text-brand" /> Comments <span className="text-sm font-normal text-muted">({model.commentCount})</span></h2>
        <select value={sort} onChange={(e) => { setSort(e.target.value as 'new' | 'old'); setPageNo(1) }} className="border border-line bg-surface px-2 py-1.5 text-xs">
          <option value="new">Newest</option><option value="old">Oldest</option>
        </select>
      </div>
      {error && <div className="mt-3 border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger">{error}</div>}
      {user ? (
        <form onSubmit={submit} className="mt-4 border border-line bg-surface p-3">
          {replyTo && <div className="mb-2 flex items-center justify-between bg-brand-soft px-2 py-1 text-[11px] text-brand-strong"><span>Replying to @{replyTo.username}</span><button type="button" onClick={() => setReplyTo(null)}>Cancel</button></div>}
          <textarea id="comment-composer" value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} placeholder="Share print settings, a question, or a make…" className="min-h-24 w-full resize-y border-0 bg-transparent text-sm text-ink outline-none" />
          <div className="flex items-center justify-between border-t border-line pt-2">
            <span className="text-[10px] text-muted">{body.length}/5000 · plain text</span>
            <button className="btn-primary !min-h-8 !px-3 !text-[11px]" disabled={busy || !body.trim()}>Post comment</button>
          </div>
        </form>
      ) : (
        <div className="mt-4 border border-line bg-canvas px-4 py-3 text-sm text-muted"><Link to={`/login?next=${encodeURIComponent(location.pathname)}`} className="font-semibold text-brand-strong hover:underline">Sign in</Link> to join the conversation.</div>
      )}
      {!page ? <p className="mt-6 text-sm text-muted">Loading comments…</p> : page.items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No comments yet. Be the first to comment.</p>
      ) : (
        <div>{page.items.map((c) => renderComment(c))}</div>
      )}
      {page && page.totalPages > 1 && (
        <div className="mt-6 flex items-center gap-3 text-xs"><button className="btn-secondary !min-h-8" disabled={pageNo <= 1} onClick={() => setPageNo((n) => n - 1)}>Previous</button><span className="text-muted">Page {pageNo} of {page.totalPages}</span><button className="btn-secondary !min-h-8" disabled={pageNo >= page.totalPages} onClick={() => setPageNo((n) => n + 1)}>Next</button></div>
      )}
    </div>
  )
}
