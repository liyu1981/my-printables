import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ErrorBox, Field, SuccessBox, TextArea, TextInput } from '../components/Form'
import { ApiError, patch, post, type User } from '../lib/api'

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

  useEffect(() => {
    if (!auth.user) return
    setProfile({
      displayName: auth.user.displayName,
      username: auth.user.username,
      bio: auth.user.bio,
      email: auth.user.email ?? '',
    })
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
    </main>
  )
}
