import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import { Navigate } from 'react-router'
import { applyAuthAtom, authAtom } from '../atoms/auth'
import { AuthLink, AuthShell } from '../components/AuthShell'
import { ErrorBox, Field, SuccessBox, TextInput } from '../components/Form'
import { ApiError, post, type AuthPayload } from '../lib/api'

export function Register() {
  const [auth] = useAtom(authAtom)
  const applyAuth = useSetAtom(applyAuthAtom)
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(false)

  if (auth.user) return <Navigate to="/" replace />

  if (!auth.settings.registrationEnabled) {
    return (
      <AuthShell title="Registration closed" subtitle="An administrator has disabled new account registration." footer={<AuthLink to="/login">Back to login</AuthLink>}>
        <p className="text-center text-sm text-muted">Ask an administrator to create an account for you.</p>
      </AuthShell>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      const payload = await post<AuthPayload>('/api/auth/register', form)
      if (payload.requiresVerification) {
        setPending(true)
        setSuccess('Account created. Check your email for a verification link, then log in.')
      } else {
        applyAuth(payload)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={pending ? 'Check your email' : 'Create account'}
      subtitle={pending ? 'Your account is waiting for email verification.' : 'Join this self-hosted model library.'}
      footer={<>Already have an account? <AuthLink to="/login">Log in</AuthLink></>}
    >
      {pending ? (
        <div className="space-y-4">
          <SuccessBox>{success}</SuccessBox>
          <AuthLink to="/login">Go to login</AuthLink>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <ErrorBox>{error}</ErrorBox>
          {auth.settings.emailVerificationEnabled && (
            <p className="border border-line bg-canvas px-3 py-2 text-xs leading-5 text-muted">
              Email verification is enabled. We will send you a verification link before your first login.
            </p>
          )}
          <Field label="Email" hint="Used to sign in and recover your account.">
            <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
          </Field>
          <Field label="Username" hint="3–32 characters: letters, numbers, dot, dash, underscore.">
            <TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required />
          </Field>
          <Field label="Display name" hint="Optional; defaults to your username.">
            <TextInput value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} autoComplete="name" />
          </Field>
          <Field label="Password" hint="At least 10 characters.">
            <TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" required />
          </Field>
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
      )}
    </AuthShell>
  )
}
