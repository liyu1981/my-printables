import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Browse } from './pages/Browse'
import { Home } from './pages/Home'
import { Placeholder } from './pages/Placeholder'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<Browse />} />
          <Route path="/collections" element={<Placeholder title="Collections" note="Collections arrive in M4." />} />
          <Route path="/tags" element={<Placeholder title="Tags" note="The tag directory arrives in M2." />} />
          <Route path="/upload" element={<Placeholder title="Upload" note="Upload arrives in M2." />} />
          <Route path="/login" element={<Placeholder title="Log in" note="Accounts arrive in M1." />} />
          <Route path="/register" element={<Placeholder title="Create account" note="Accounts arrive in M1." />} />
          <Route path="/setup" element={<Placeholder title="First run" note="Setup arrives in M1." />} />
          <Route path="/settings" element={<Placeholder title="Settings" note="Settings arrive in M1." />} />
          <Route path="/admin" element={<Placeholder title="Admin" note="Admin arrives in M1." />} />
          <Route path="*" element={<Placeholder title="Page not found" note="The page you requested does not exist." />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
