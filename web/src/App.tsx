import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { authAtom, refreshAuthAtom } from './atoms/auth'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RequireAuth } from './components/RequireAuth'
import { Admin } from './pages/Admin'
import { Browse } from './pages/Browse'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Placeholder } from './pages/Placeholder'
import { Register } from './pages/Register'
import { Settings } from './pages/Settings'
import { Setup } from './pages/Setup'
import { VerifyEmail } from './pages/VerifyEmail'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function VerificationBanner() {
  const [auth] = useAtom(authAtom)
  if (!auth.user || !auth.settings.emailVerificationEnabled || auth.user.emailVerifiedAt) return null
  return (
    <div className="border-b border-warning/60 bg-warning/15">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
        <span className="font-medium text-ink">Your email is not verified yet. Some actions may be limited.</span>
        <Link to="/settings" className="font-semibold text-brand-strong hover:underline">Open settings to resend</Link>
      </div>
    </div>
  )
}

export function App() {
  const refresh = useSetAtom(refreshAuthAtom)
  useEffect(() => { refresh() }, [refresh])

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <VerificationBanner />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><Admin /></RequireAuth>} />
          <Route path="/collections" element={<Placeholder title="Collections" note="Collections arrive in M4." />} />
          <Route path="/tags" element={<Placeholder title="Tags" note="The tag directory arrives in M2." />} />
          <Route path="/upload" element={<RequireAuth><Placeholder title="Upload" note="Upload arrives in M2." /></RequireAuth>} />
          <Route path="*" element={<Placeholder title="Page not found" note="The page you requested does not exist." />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
