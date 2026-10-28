import { Box, Download, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { CollectionCard } from '../components/CollectionCard'
import { ModelCard } from '../components/ModelCard'
import { api, formatDate } from '../lib/api'
import type { ModelPage } from '../lib/models'
import type { Collection } from '../lib/social'

type ProfileData = {
  user: { id: string; username: string; displayName: string; bio: string; role: string; createdAt: number }
  stats: { models: number; downloads: number; likes: number }
}

export function Profile() {
  const { username = '' } = useParams()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [page, setPage] = useState<ModelPage | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([
      api<ProfileData>(`/api/users/${username}`),
      api<ModelPage>(`/api/users/${username}/models?perPage=48`),
      api<{ items: Collection[] }>(`/api/users/${username}/collections?perPage=12`),
    ]).then(([p, m, c]) => { setProfile(p); setPage(m); setCollections(c.items) }).catch(() => setError('User not found.'))
  }, [username])
  if (error) return <main className="container-page py-16 text-sm text-muted">{error}</main>
  if (!profile) return <main className="container-page py-16 text-sm text-muted">Loading…</main>
  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-center gap-5 border-b border-line pb-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft font-display text-2xl font-bold text-brand-strong">{profile.user.displayName.slice(0, 1).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-ink">{profile.user.displayName}</h1>
          <p className="text-sm text-muted">@{profile.user.username} · joined {formatDate(profile.user.createdAt)}</p>
          {profile.user.bio && <p className="mt-2 max-w-2xl text-sm leading-6 text-text">{profile.user.bio}</p>}
        </div>
        <div className="flex gap-6 text-xs text-muted">
          <span className="flex items-center gap-1"><Box className="h-4 w-4" /> {profile.stats.models} models</span>
          <span className="flex items-center gap-1"><Download className="h-4 w-4" /> {profile.stats.downloads}</span>
          <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {profile.stats.likes}</span>
        </div>
      </div>
      <h2 className="mt-8 font-display text-xl font-bold text-ink">Models</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(page?.items ?? []).map((m) => <ModelCard key={m.id} model={m} />)}
      </div>
      {page && page.items.length === 0 && <p className="mt-6 text-sm text-muted">No public models yet. <Link to="/models" className="text-brand-strong hover:underline">Browse the library</Link>.</p>}
      {collections.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-ink">Collections</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{collections.map((c) => <CollectionCard key={c.id} collection={c} />)}</div>
        </section>
      )}
    </main>
  )
}
