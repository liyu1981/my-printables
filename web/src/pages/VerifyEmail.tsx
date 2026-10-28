import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { applyAuthAtom } from '../atoms/auth'
import { AuthShell } from '../components/AuthShell'
import { ErrorBox, Field, SuccessBox, TextInput } from '../components/Form'
import { ApiError, post, type AuthPayload } from '../lib/api'

export function VerifyEmail() {
  const [params] = useSearchParams()
  const applyAuth = useSetAtom(applyAuthAtom)
  const token = params.get('token') ?? ''
  const [state, setState] = useState<'idle' | 'working' | 'success' | 'error'>(token ? 'working' : 'idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resent, setResent] = useState('')
  const [error, setError] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (!token || ran.current) return
    ran.current = true
    post<AuthPayload>('/api/auth/verify-email', { token })
      .then((payload) => {
        applyAuth(payload)
        setState('success')
        setMessage('Your email is verified. You are now signed in.')
      })
      .catch((err) => {
        setState('error')
        setMessage(err instanceof ApiError ? err.message : 'This verification link is invalid or expired.')
      })
  }, [token, applyAuth])

  async function resend(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResent('')
    try {
      await post('/api/auth/resend-verification', { email })
      setResent('If an unverified account exists for that address, a message has been sent.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend the message.')
    }
  }

  return (
    <AuthShell title="Verify email" footer={<Link to="/login" className="font-semibold text-brand-strong">Go to login</Link>}>
      <div className="space-y-5">
        {state === 'working' && <p className="text-center text-sm text-muted">Verifying your link…</p>}
        {state === 'success' && (
          <>
            <SuccessBox>{message}</SuccessBox>
            <Link to="/" className="btn-primary w-full">Open library</Link>
          </>
        )}
        {state === 'error' && <ErrorBox>{message}</ErrorBox>}
        {(state === 'idle' || state === 'error') && (
          <form onSubmit={resend} className="space-y-4 border-t border-line pt-5">
            <p className="text-xs leading-5 text-muted">Need a new link? Enter the email address used for the account.</p>
            <ErrorBox>{error}</ErrorBox>
            <SuccessBox>{resent}</SuccessBox>
            <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
            <button className="btn-secondary w-full">Resend verification email</button>
          </form>
        )}
      </div>
    </AuthShell>
  )
}
