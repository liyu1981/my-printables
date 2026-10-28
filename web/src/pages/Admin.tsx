import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { authAtom } from '../atoms/auth'
import { ErrorBox, Field, SuccessBox, TextInput } from '../components/Form'
import { ApiError, api, del, formatBytes, formatDate, patch, post, type User } from '../lib/api'
import type { Model, ModelPage } from '../lib/models'
import type { Collection, CollectionPage } from '../lib/social'

type AdminSettings = Record<string, string>

type Stats = { users: number; models: number; mediaBytes: number; files?: number; downloads24h?: number }
type AdminComment = { id: string; modelId: string; modelTitle: string; body: string; username: string; displayName: string; createdAt: number; deleted: boolean }
type AuditEntry = { id: string; actorName: string; action: string; targetType: string; targetId: string; createdAt: number }

export function Admin() {
  const [auth, setAuth] = useAtom(authAtom)
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<AdminSettings>({})
  const [smtpConfigured, setSmtpConfigured] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [comments, setComments] = useState<AdminComment[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [contentTab, setContentTab] = useState<'models' | 'comments' | 'collections' | 'audit'>('models')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const [q, setQ] = useState('')

  async function load() {
    setError('')
    try {
      const [u, s, st, mo, co, cl, au] = await Promise.all([
        api<{ items: User[] }>(`/api/admin/users?q=${encodeURIComponent(q)}`),
        api<{ settings: AdminSettings; smtpConfigured: boolean }>('/api/admin/settings'),
        api<Stats>('/api/admin/stats'),
        api<ModelPage>('/api/admin/models?perPage=100'),
        api<{ items: AdminComment[] }>('/api/admin/comments'),
        api<CollectionPage>('/api/admin/collections'),
        api<{ items: AuditEntry[] }>('/api/admin/audit'),
      ])
      setUsers(u.items)
      setSettings(s.settings)
      setSmtpConfigured(s.smtpConfigured)
      setStats(st)
      setModels(mo.items)
      setComments(co.items)
      setCollections(cl.items)
      setAudit(au.items)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load admin data.')
    }
  }

  useEffect(() => { load() }, [])

  if (!auth.user || auth.user.role !== 'admin') return null

  async function updateUser(u: User, fields: Record<string, unknown>) {
    setBusy(u.id); setError(''); setMsg('')
    try {
      await patch(`/api/admin/users/${u.id}`, fields, auth.csrf)
      setMsg('User updated.')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update user.')
    } finally { setBusy('') }
  }

  async function removeUser(u: User) {
    if (!confirm(`Delete ${u.email}? Their sessions will be revoked.`)) return
    setBusy(u.id); setError(''); setMsg('')
    try {
      await del(`/api/admin/users/${u.id}`, auth.csrf)
      setMsg('User deleted.')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete user.')
    } finally { setBusy('') }
  }

  async function resetPassword(u: User) {
    const password = window.prompt(`New password for ${u.email} (at least 10 characters):`)
    if (!password) return
    await updateUser(u, { password })
  }

  async function updateModel(m: Model, fields: Record<string, unknown>) {
    setBusy(m.id); setError(''); setMsg('')
    try { await patch(`/api/admin/models/${m.id}`, fields, auth.csrf); setMsg('Model updated.'); await load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not update model.') }
    finally { setBusy('') }
  }
  async function deleteModel(m: Model) {
    if (!confirm(`Delete “${m.title}”?`)) return
    setBusy(m.id); setError(''); setMsg('')
    try { await del(`/api/admin/models/${m.id}`, auth.csrf); setMsg('Model deleted.'); await load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete model.') }
    finally { setBusy('') }
  }
  async function deleteAdminComment(id: string) {
    if (!confirm('Delete this comment?')) return
    try { await del(`/api/admin/comments/${id}`, auth.csrf); await load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete comment.') }
  }
  async function deleteAdminCollection(id: string) {
    if (!confirm('Delete this collection?')) return
    try { await del(`/api/admin/collections/${id}`, auth.csrf); await load() }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Could not delete collection.') }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    setBusy('settings'); setError(''); setMsg('')
    try {
      const res = await patch<{ settings: AdminSettings }>('/api/admin/settings', settings, auth.csrf)
      setSettings(res.settings)
      setAuth((prev) => ({ ...prev, settings: { ...prev.settings,
        siteName: res.settings.site_name ?? prev.settings.siteName,
        footerText: res.settings.footer_text ?? prev.settings.footerText,
        registrationEnabled: res.settings.registration_enabled === 'true',
        emailVerificationEnabled: res.settings.email_verification_enabled === 'true',
        requireLoginToBrowse: res.settings.require_login_to_browse === 'true',
        maxUploadMB: Number(res.settings.max_upload_mb ?? prev.settings.maxUploadMB),
        allowedFormats: res.settings.allowed_formats ?? prev.settings.allowedFormats,
      } }))
      setMsg('Settings saved.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save settings.')
    } finally { setBusy('') }
  }

  async function testSMTP() {
    setBusy('smtp'); setError(''); setMsg('')
    try {
      await post('/api/admin/smtp/test', {}, auth.csrf)
      setMsg('Test email sent. Check the admin inbox.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'SMTP test failed.')
    } finally { setBusy('') }
  }

  function setSetting(key: string, value: string) { setSettings((s) => ({ ...s, [key]: value })) }
  function setBool(key: string, value: boolean) { setSetting(key, value ? 'true' : 'false') }

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Admin</h1>
          <p className="mt-1 text-sm text-muted">Users, library settings, and email verification.</p>
        </div>
        <button className="btn-secondary" onClick={load}>Refresh</button>
      </div>

      {error && <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>}
      {msg && <div className="mt-4"><SuccessBox>{msg}</SuccessBox></div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ['Users', stats?.users ?? '—'],
          ['Models', stats?.models ?? '—'],
          ['Media', stats ? formatBytes(stats.mediaBytes) : '—'],
          ['Files', stats?.files ?? '—'],
          ['Downloads (24h)', stats?.downloads24h ?? '—'],
        ].map(([label, value]) => (
          <div key={label} className="card-line p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">Users</h2>
          <form onSubmit={(e) => { e.preventDefault(); load() }} className="flex gap-2">
            <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="!w-56" />
            <button className="btn-secondary">Search</button>
          </form>
        </div>
        <div className="mt-4 overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Active</th>
                <th className="px-3 py-3">Verified</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0 hover:bg-canvas/70">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-ink">{u.displayName}</div>
                    <div className="text-muted">{u.email} · @{u.username}</div>
                  </td>
                  <td className="px-3 py-3">
                    <select value={u.role} disabled={u.id === auth.user?.id || busy === u.id} onChange={(e) => updateUser(u, { role: e.target.value })} className="border border-line bg-surface px-2 py-1 text-xs">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-xs font-semibold text-brand-strong hover:underline" disabled={u.id === auth.user?.id || busy === u.id} onClick={() => updateUser(u, { isActive: !u.isActive })}>
                      {u.isActive ? 'deactivate' : 'activate'}
                    </button>
                  </td>
                  <td className="px-3 py-3">{u.emailVerifiedAt ? 'yes' : <button className="text-brand-strong hover:underline" onClick={() => updateUser(u, { emailVerified: true })}>verify</button>}</td>
                  <td className="px-3 py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary !min-h-8 !px-2 !text-[11px]" onClick={() => resetPassword(u)} disabled={busy === u.id}>Reset password</button>
                      <button className="btn-secondary !min-h-8 !border-danger/40 !px-2 !text-[11px] !text-danger" onClick={() => removeUser(u)} disabled={u.id === auth.user?.id || busy === u.id}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">Content</h2>
          <div className="flex gap-4 text-xs font-bold text-muted">
            {(['models', 'comments', 'collections', 'audit'] as const).map((t) => (
              <button key={t} onClick={() => setContentTab(t)} className={`border-b-2 pb-1 capitalize ${contentTab === t ? 'border-brand text-ink' : 'border-transparent'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mt-3 overflow-x-auto border border-line bg-surface">
          {contentTab === 'models' && (
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-[0.08em] text-muted"><tr><th className="px-3 py-3">Model</th><th className="px-3 py-3">Owner</th><th className="px-3 py-3">Visibility</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Featured</th><th className="px-3 py-3 text-right">Actions</th></tr></thead>
              <tbody>{models.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0 hover:bg-canvas/70">
                  <td className="px-3 py-3"><div className="max-w-[260px] truncate font-semibold text-ink">{m.title}</div><div className="text-muted">{m.fileCount} files · {m.downloadCount} downloads</div></td>
                  <td className="px-3 py-3 text-muted">@{m.ownerUsername}</td>
                  <td className="px-3 py-3"><select value={m.visibility} onChange={(e) => updateModel(m, { visibility: e.target.value })} className="border border-line bg-surface px-2 py-1 text-xs"><option value="public">public</option><option value="members">members</option><option value="private">private</option></select></td>
                  <td className="px-3 py-3"><select value={m.status} onChange={(e) => updateModel(m, { status: e.target.value })} className="border border-line bg-surface px-2 py-1 text-xs"><option value="draft">draft</option><option value="published">published</option></select></td>
                  <td className="px-3 py-3"><button onClick={() => updateModel(m, { featured: !m.featured })} className={`font-semibold ${m.featured ? 'text-brand-strong' : 'text-muted'} hover:underline`}>{m.featured ? 'featured' : 'feature'}</button></td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><a href={`/model/${m.id}/${m.slug}`} className="btn-secondary !min-h-8 !px-2 !text-[11px]">View</a><button onClick={() => deleteModel(m)} className="btn-secondary !min-h-8 !border-danger/40 !px-2 !text-[11px] !text-danger" disabled={busy === m.id}>Delete</button></div></td>
                </tr>
              ))}{models.length === 0 && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted">No models.</td></tr>}</tbody>
            </table>
          )}
          {contentTab === 'comments' && (
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-[0.08em] text-muted"><tr><th className="px-3 py-3">Model</th><th className="px-3 py-3">User</th><th className="px-3 py-3">Comment</th><th className="px-3 py-3">Date</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
              <tbody>{comments.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-canvas/70"><td className="px-3 py-3">{c.modelTitle}</td><td className="px-3 py-3 text-muted">@{c.username}</td><td className="max-w-[380px] px-3 py-3"><div className="line-clamp-2 text-text">{c.deleted ? '[deleted]' : c.body}</div></td><td className="px-3 py-3 text-muted">{formatDate(c.createdAt)}</td><td className="px-3 py-3 text-right"><button onClick={() => deleteAdminComment(c.id)} className="text-[11px] font-semibold text-danger hover:underline">Delete</button></td></tr>
              ))}{comments.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted">No comments.</td></tr>}</tbody>
            </table>
          )}
          {contentTab === 'collections' && (
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-[0.08em] text-muted"><tr><th className="px-3 py-3">Collection</th><th className="px-3 py-3">Owner</th><th className="px-3 py-3">Visibility</th><th className="px-3 py-3">Models</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
              <tbody>{collections.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-canvas/70"><td className="px-3 py-3 font-semibold text-ink">{c.name}</td><td className="px-3 py-3 text-muted">@{c.ownerUsername}</td><td className="px-3 py-3">{c.visibility}</td><td className="px-3 py-3">{c.modelCount}</td><td className="px-3 py-3 text-right"><div className="flex justify-end gap-2"><a href={`/collections/${c.id}/${c.slug}`} className="text-[11px] font-semibold text-brand-strong hover:underline">View</a><button onClick={() => deleteAdminCollection(c.id)} className="text-[11px] font-semibold text-danger hover:underline">Delete</button></div></td></tr>
              ))}{collections.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted">No collections.</td></tr>}</tbody>
            </table>
          )}
          {contentTab === 'audit' && (
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-[0.08em] text-muted"><tr><th className="px-3 py-3">When</th><th className="px-3 py-3">Actor</th><th className="px-3 py-3">Action</th><th className="px-3 py-3">Target</th></tr></thead>
              <tbody>{audit.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0 hover:bg-canvas/70"><td className="px-3 py-3 text-muted">{formatDate(a.createdAt)}</td><td className="px-3 py-3">{a.actorName || 'system'}</td><td className="px-3 py-3"><code className="bg-canvas px-1 py-0.5 text-[10px]">{a.action}</code></td><td className="px-3 py-3 text-muted">{a.targetType} {a.targetId.slice(0, 12)}</td></tr>
              ))}{audit.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-muted">No audit entries.</td></tr>}</tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-ink">Site settings</h2>
        <form onSubmit={saveSettings} className="mt-4 grid gap-6 border border-line bg-surface p-5 md:grid-cols-2">
          <Field label="Site name"><TextInput value={settings.site_name ?? ''} onChange={(e) => setSetting('site_name', e.target.value)} /></Field>
          <Field label="Max upload (MB)"><TextInput type="number" value={settings.max_upload_mb ?? '1024'} onChange={(e) => setSetting('max_upload_mb', e.target.value)} /></Field>
          <Field label="Allowed formats"><TextInput value={settings.allowed_formats ?? ''} onChange={(e) => setSetting('allowed_formats', e.target.value)} /></Field>
          <Field label="Default visibility">
            <select value={settings.default_visibility ?? 'public'} onChange={(e) => setSetting('default_visibility', e.target.value)} className="input-line">
              <option value="public">Public</option>
              <option value="members">Members only</option>
              <option value="private">Private</option>
            </select>
          </Field>
          <label className="flex items-center gap-3 text-sm text-ink"><input type="checkbox" checked={settings.registration_enabled === 'true'} onChange={(e) => setBool('registration_enabled', e.target.checked)} className="h-4 w-4 accent-brand" /> Open registration</label>
          <label className="flex items-center gap-3 text-sm text-ink"><input type="checkbox" checked={settings.require_login_to_browse === 'true'} onChange={(e) => setBool('require_login_to_browse', e.target.checked)} className="h-4 w-4 accent-brand" /> Require login to browse</label>
          <label className="flex items-center gap-3 text-sm text-ink"><input type="checkbox" checked={settings.email_verification_enabled === 'true'} onChange={(e) => setBool('email_verification_enabled', e.target.checked)} disabled={!smtpConfigured} className="h-4 w-4 accent-brand" /> Require email verification <span className="text-xs text-muted">{smtpConfigured ? '(SMTP configured)' : '(configure SMTP first)'}</span></label>
          <div className="flex items-end gap-2">
            <button type="button" className="btn-secondary" onClick={testSMTP} disabled={!smtpConfigured || busy === 'smtp'}>Send test email</button>
          </div>
          <div className="md:col-span-2 flex justify-end border-t border-line pt-4">
            <button className="btn-primary" disabled={busy === 'settings'}>{busy === 'settings' ? 'Saving…' : 'Save settings'}</button>
          </div>
        </form>
      </section>
    </main>
  )
}
