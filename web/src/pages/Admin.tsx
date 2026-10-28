import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { authAtom } from '../atoms/auth'
import { ErrorBox, Field, SuccessBox, TextInput } from '../components/Form'
import { ApiError, api, del, formatBytes, formatDate, patch, post, type User } from '../lib/api'

type AdminSettings = Record<string, string>

type Stats = { users: number; models: number; mediaBytes: number }

export function Admin() {
  const [auth] = useAtom(authAtom)
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<AdminSettings>({})
  const [smtpConfigured, setSmtpConfigured] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const [q, setQ] = useState('')

  async function load() {
    setError('')
    try {
      const [u, s, st] = await Promise.all([
        api<{ items: User[] }>(`/api/admin/users?q=${encodeURIComponent(q)}`),
        api<{ settings: AdminSettings; smtpConfigured: boolean }>('/api/admin/settings'),
        api<Stats>('/api/admin/stats'),
      ])
      setUsers(u.items)
      setSettings(s.settings)
      setSmtpConfigured(s.smtpConfigured)
      setStats(st)
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

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    setBusy('settings'); setError(''); setMsg('')
    try {
      const res = await patch<{ settings: AdminSettings }>('/api/admin/settings', settings, auth.csrf)
      setSettings(res.settings)
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

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Users', stats?.users ?? '—'],
          ['Models', stats?.models ?? '—'],
          ['Media', stats ? formatBytes(stats.mediaBytes) : '—'],
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
