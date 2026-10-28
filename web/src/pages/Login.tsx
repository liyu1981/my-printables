import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { applyAuthAtom, authAtom } from '../atoms/auth'
import { AuthLink, AuthShell } from '../components/AuthShell'
import { ErrorBox, Field, TextInput } from '../components/Form'
import { ApiError, post, type AuthPayload } from '../lib/api'
import { useAtom } from 'jotai'

export function Login() {
  const [auth] = useAtom(authAtom)
  const applyAuth = useSetAtom(applyAuthAtom)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const next = params.get('next') || '/'

  if (auth.user) return <Navigate to={next} replace />

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = await post<AuthPayload>('/api/auth/login', { login, password })
      applyAuth(payload)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Access your model library, uploads, and collections."
      footer={<>New here? <AuthLink to="/register">Create an account</AuthLink></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <ErrorBox>{error}</ErrorBox>
        <Field label="Email or username">
          <TextInput value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required autoFocus />
        </Field>
        <Field label="Password">
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
        <p className="text-center text-[11px] text-muted">
          Forgot your password? Ask an administrator or use the CLI reset command.
        </p>
        <p className="text-center text-xs text-muted">
          <Link to="/" className="hover:text-ink">Back to library</Link>
        </p>
      </form>
    </AuthShell>
  )
}
