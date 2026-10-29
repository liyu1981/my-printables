import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, Copy, KeyRound, Loader2, Trash2 } from 'lucide-react'
import { authAtom } from '../atoms/auth'
import { ErrorBox, Field, SuccessBox, TextArea, TextInput } from '../components/Form'
import { ApiError, api, del, formatDate, patch, post, type User } from '../lib/api'
import { FolderImport } from '../components/FolderImport'

type APIKey = { id: string; name: string; prefix: string; createdAt: number; lastUsedAt: number | null }

export function Settings() {
  const [auth, setAuth] = useAtom(authAtom)
  const navigate = useNavigate()
  const [profile, setProfile] = useState({ displayName: '', username: '', bio: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([])
  const [keyName, setKeyName] = useState('')
  const [newKey, setNewKey] = useState('')
  const [keyErr, setKeyErr] = useState('')
  const [keyMsg, setKeyMsg] = useState('')
  const [keyBusy, setKeyBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!auth.user) return
    setProfile({
      displayName: auth.user.displayName,
      username: auth.user.username,
      bio: auth.user.bio,
      email: auth.user.email ?? '',
    })
  }, [auth.user?.id])

  useEffect(() => {
    if (!auth.user) return
    api<{ items: APIKey[] }>('/api/auth/api-keys').then((r) => setAPIKeys(r.items)).catch(() => setKeyErr('Could not load API keys.'))
  }, [auth.user?.id])

  if (!auth.user) return null

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setProfileErr('')
    setProfileMsg('')
    try {
      const res = await patch<{ user?: User; requiresVerification?: boolean }>('/api/auth/me', profile, auth.csrf)
      if (res.requiresVerification) {
        setAuth((prev) => ({ ...prev, user: null, csrf: '' }))
        navigate('/login?verify=sent')
        return
      }
      if (res.user) {
        setAuth((prev) => ({ ...prev, user: res.user! }))
        setProfileMsg('Profile saved.')
      }
    } catch (err) {
      setProfileErr(err instanceof ApiError ? err.message : 'Could not save profile.')
    } finally {
      setBusy(false)
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setPasswordErr('')
    setPasswordMsg('')
    try {
      await post('/api/auth/password', passwords, auth.csrf)
      setPasswords({ currentPassword: '', newPassword: '' })
      setPasswordMsg('Password changed. Other sessions were signed out.')
    } catch (err) {
      setPasswordErr(err instanceof ApiError ? err.message : 'Could not change password.')
    } finally {
      setBusy(false)
    }
  }

  async function createAPIKey(e: React.FormEvent) {
    e.preventDefault()
    if (!keyName.trim()) return
    setKeyBusy(true); setKeyErr(''); setKeyMsg('')
    try {
      const res = await post<{ key: string; apiKey: APIKey }>('/api/auth/api-keys', { name: keyName.trim() }, auth.csrf)
      setAPIKeys((prev) => [res.apiKey, ...prev])
      setNewKey(res.key)
      setKeyName('')
      setCopied(false)
      setKeyMsg('API key created. Copy it now — it will not be shown again.')
    } catch (err) {
      setKeyErr(err instanceof ApiError ? err.message : 'Could not create API key.')
    } finally { setKeyBusy(false) }
  }

  async function revokeAPIKey(id: string) {
    if (!confirm('Revoke this API key? Any MCP client using it will lose access.')) return
    setKeyErr(''); setKeyMsg('')
    try {
      await del(`/api/auth/api-keys/${id}`, auth.csrf)
      setAPIKeys((prev) => prev.filter((k) => k.id !== id))
      setKeyMsg('API key revoked.')
    } catch (err) {
      setKeyErr(err instanceof ApiError ? err.message : 'Could not revoke API key.')
    }
  }

  async function copyKey() {
    await navigator.clipboard?.writeText(newKey)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function resend() {
    setResendMsg('')
    try {
      await post('/api/auth/resend-verification', { email: auth.user?.email })
      setResendMsg('If this account is unverified, a message has been sent.')
    } catch (err) {
      setResendMsg(err instanceof ApiError ? err.message : 'Could not resend.')
    }
  }

  return (
    <main className="container-page max-w-[820px] py-10">
      <h1 className="text-3xl font-bold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your profile, sign-in, and email verification.</p>

      {auth.settings.emailVerificationEnabled && !auth.user.emailVerifiedAt && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-warning/50 bg-warning/10 px-4 py-3 text-sm">
          <span>Your email is not verified yet.</span>
          <button className="btn-secondary" onClick={resend}>Resend email</button>
        </div>
      )}
      {resendMsg && <div className="mt-3"><SuccessBox>{resendMsg}</SuccessBox></div>}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="card-line p-5">
          <h2 className="font-display text-lg font-bold text-ink">Profile</h2>
          <form onSubmit={saveProfile} className="mt-4 space-y-4">
            <ErrorBox>{profileErr}</ErrorBox>
            <SuccessBox>{profileMsg}</SuccessBox>
            <Field label="Display name"><TextInput value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} /></Field>
            <Field label="Username"><TextInput value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></Field>
            <Field label="Email" hint={auth.settings.emailVerificationEnabled ? 'Changing this will require re-verification and sign you out.' : undefined}>
              <TextInput type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </Field>
            <Field label="Bio"><TextArea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></Field>
            <button className="btn-primary" disabled={busy}>Save profile</button>
          </form>
        </section>

        <section className="card-line h-fit p-5">
          <h2 className="font-display text-lg font-bold text-ink">Password</h2>
          <form onSubmit={savePassword} className="mt-4 space-y-4">
            <ErrorBox>{passwordErr}</ErrorBox>
            <SuccessBox>{passwordMsg}</SuccessBox>
            <Field label="Current password"><TextInput type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></Field>
            <Field label="New password" hint="At least 10 characters."><TextInput type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></Field>
            <button className="btn-secondary" disabled={busy}>Change password</button>
          </form>
          <div className="mt-6 border-t border-line pt-4 text-xs text-muted">
            Account created {new Date(auth.user.createdAt * 1000).toLocaleDateString()}.
            Role: <span className="font-semibold text-ink">{auth.user.role}</span>.
          </div>
        </section>
      </div>

      <section className="card-line mt-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink"><KeyRound className="h-4 w-4 text-brand" /> API keys</h2>
            <p className="mt-1 text-xs leading-5 text-muted">Use API keys with the MCP server. Keys can read, create, and update content as you; they cannot delete models.</p>
          </div>
        </div>
        <ErrorBox>{keyErr}</ErrorBox>
        <SuccessBox>{keyMsg}</SuccessBox>
        {newKey && (
          <div className="mt-4 border border-brand/40 bg-brand-soft p-3">
            <p className="text-[11px] font-bold text-ink">Your new API key (shown once)</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="min-w-0 flex-1 break-all bg-surface px-2 py-1.5 text-xs text-ink">{newKey}</code>
              <button type="button" onClick={copyKey} className="btn-secondary !min-h-8 !px-2 !text-[11px]">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <p className="mt-2 text-[10px] text-muted">MCP clients: <code>Authorization: Bearer &lt;key&gt;</code></p>
          </div>
        )}
        <form onSubmit={createAPIKey} className="mt-4 flex flex-wrap items-end gap-2">
          <Field label="Key name"><TextInput value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g. Claude Desktop" className="!w-56" /></Field>
          <button className="btn-primary" disabled={keyBusy || !keyName.trim()}>{keyBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create key'}</button>
        </form>
        <div className="mt-5 border border-line">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex flex-wrap items-center gap-3 border-b border-line px-3 py-3 last:border-0">
              <KeyRound className="h-4 w-4 text-brand" />
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{k.name}</p><p className="text-[11px] text-muted"><code>{k.prefix}…</code> · created {formatDate(k.createdAt)} · last used {k.lastUsedAt ? formatDate(k.lastUsedAt) : 'never'}</p></div>
              <button type="button" onClick={() => revokeAPIKey(k.id)} className="flex items-center gap-1 text-[11px] font-semibold text-danger hover:underline"><Trash2 className="h-3.5 w-3.5" /> Revoke</button>
            </div>
          ))}
          {apiKeys.length === 0 && <p className="p-4 text-xs text-muted">No API keys yet.</p>}
        </div>
      </section>

      <FolderImport />
    </main>
  )
}
