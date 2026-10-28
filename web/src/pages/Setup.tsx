import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { applyAuthAtom } from '../atoms/auth'
import { AuthShell } from '../components/AuthShell'
import { ErrorBox, Field, TextInput } from '../components/Form'
import { ApiError, api, post, type AuthPayload } from '../lib/api'

export function Setup() {
  const applyAuth = useSetAtom(applyAuthAtom)
  const navigate = useNavigate()
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [form, setForm] = useState({ email: '', username: 'admin', displayName: 'Administrator', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<{ needsSetup: boolean }>('/api/setup/status').then((r) => setNeedsSetup(r.needsSetup)).catch(() => setNeedsSetup(false))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = await post<AuthPayload>('/api/setup', form)
      applyAuth(payload)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not complete setup.')
    } finally {
      setBusy(false)
    }
  }

  if (needsSetup === null) {
    return <AuthShell title="First run"><p className="text-center text-sm text-muted">Checking setup state…</p></AuthShell>
  }
  if (!needsSetup) {
    return (
      <AuthShell title="Already set up" footer={<Link to="/login" className="font-semibold text-brand-strong">Go to login</Link>}>
        <p className="text-center text-sm text-muted">This library already has an administrator account.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create the administrator"
      subtitle="This first-run page is only available until the first account exists."
      footer={<>This account can manage users, storage, and settings.</>}
    >
      <form onSubmit={submit} className="space-y-4">
        <ErrorBox>{error}</ErrorBox>
        <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus /></Field>
        <Field label="Username"><TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></Field>
        <Field label="Display name"><TextInput value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></Field>
        <Field label="Password" hint="At least 10 characters."><TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Field>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Create administrator'}</button>
      </form>
    </AuthShell>
  )
}
