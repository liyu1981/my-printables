import { Star } from 'lucide-react'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { Link } from 'react-router'
import { authAtom } from '../atoms/auth'
import { ApiError } from '../lib/api'
import type { Model } from '../lib/models'
import { rateModel, unrateModel, type RatingSummary } from '../lib/social'

export function RatingInput({ model, onChange }: { model: Model; onChange: (s: RatingSummary) => void }) {
  const [auth] = useAtom(authAtom)
  const [hover, setHover] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const current = model.myRating || 0
  const shown = hover || current

  async function choose(score: number) {
    if (!auth.user) return
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const summary = score === current ? await unrateModel(model.id, auth.csrf) : await rateModel(model.id, score, auth.csrf)
      onChange(summary)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save rating.')
    } finally { setBusy(false) }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <div className="flex items-center" role="radiogroup" aria-label="Rate this model">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={current === score}
              aria-label={`${score} star${score === 1 ? '' : 's'}`}
              disabled={!auth.user || busy}
              onMouseEnter={() => setHover(score)}
              onMouseLeave={() => setHover(0)}
              onClick={() => choose(score)}
              className="p-0.5 disabled:cursor-default"
            >
              <Star className={`h-4 w-4 ${score <= shown ? 'fill-current text-brand' : 'text-line-strong'}`} />
            </button>
          ))}
        </div>
        <span className="font-semibold text-ink">{model.ratingCount ? model.ratingAvg.toFixed(1) : 'No ratings'}</span>
        {model.ratingCount > 0 && <span>({model.ratingCount})</span>}
        {!auth.user && <Link to={`/login?next=${encodeURIComponent(location.pathname)}`} className="text-brand-strong hover:underline">Sign in to rate</Link>}
        {auth.user && current > 0 && <button onClick={() => choose(current)} disabled={busy} className="text-[10px] text-muted hover:text-ink">Remove</button>}
      </div>
      {error && <p className="mt-1 text-[10px] text-danger">{error}</p>}
    </div>
  )
}
