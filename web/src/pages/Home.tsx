import { ArrowRight, Box, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CollectionCard } from '../components/CollectionCard'
import { ModelCard } from '../components/ModelCard'
import { api } from '../lib/api'
import { getModels, type Category, type Model } from '../lib/models'
import { getCollections, type Collection } from '../lib/social'

type Creator = { username: string; displayName: string; bio: string; modelCount: number; downloads: number; likes: number }

type Stats = { models: number; users: number; downloads: number; files: number }

export function Home() {
  const [featured, setFeatured] = useState<Model[]>([])
  const [latest, setLatest] = useState<Model[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      getModels('featured=1&sort=newest&perPage=4'),
      getModels('sort=newest&perPage=8'),
      api<{ items: Category[] }>('/api/categories'),
      api<Stats>('/api/stats'),
      getCollections('perPage=4'),
      api<{ items: Creator[] }>('/api/creators?limit=6'),
    ]).then(([f, l, c, s, col, cr]) => {
      setFeatured(f.items)
      setLatest(l.items)
      setCategories(c.items)
      setStats(s)
      setCollections(col.items)
      setCreators(cr.items)
    }).catch(() => {}).finally(() => setLoaded(true))
  }, [])

  const heroModels = featured.length ? featured : latest.slice(0, 4)

  return (
    <main>
      <section className="container-page pt-0">
        <div className="relative mt-4 overflow-hidden rounded-[2px] bg-ink">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,#fa6831_0%,transparent_34%),radial-gradient(circle_at_78%_70%,#a21caf33_0%,transparent_38%),linear-gradient(120deg,#1f2124_20%,#2a1813_100%)]" />
          <div className="relative grid min-h-[320px] items-center gap-8 px-6 py-12 md:min-h-[420px] md:grid-cols-[1.1fr_0.9fr] md:px-14">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">Your home model library</p>
              <h1 className="max-w-[620px] font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.035em] text-white md:text-6xl">Every model.<br />One place.</h1>
              <p className="mt-4 max-w-[440px] text-sm leading-6 text-white/70 md:text-base">Upload, organize, and preview your 3D files from any browser. Public by default, private when you need it.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/models" className="btn-primary">Browse models <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/upload" className="inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-white/30 px-5 text-sm font-semibold text-white hover:border-white/70"><Upload className="h-4 w-4" /> Upload a model</Link>
              </div>
            </div>
            <div className="hidden justify-end md:flex">
              <div className="relative flex h-52 w-52 rotate-[-6deg] items-center justify-center border border-white/15 bg-white/5">
                <Box className="h-32 w-32 text-brand" strokeWidth={0.9} />
                <span className="absolute bottom-3 right-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">STL · 3MF · OBJ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">{featured.length ? 'Featured Models' : 'Recent Models'}</h2>
            <p className="mt-1 text-sm text-muted">{heroModels.length ? 'Selected from your library.' : 'Your library is waiting for its first upload.'}</p>
          </div>
          <Link to="/models" className="hidden text-sm font-semibold text-brand-strong hover:underline sm:block">Explore all models</Link>
        </div>
        {!loaded ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="card-line h-[360px] animate-pulse bg-canvas" />)}
          </div>
        ) : heroModels.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{heroModels.map((m) => <ModelCard key={m.id} model={m} />)}</div>
        ) : (
          <div className="flex flex-col items-center border border-dashed border-line bg-surface p-12 text-center">
            <Box className="h-10 w-10 text-line-strong" />
            <h3 className="mt-3 font-display text-lg font-bold text-ink">No models yet</h3>
            <p className="mt-1 text-sm text-muted">Upload an STL or 3MF to get started.</p>
            <Link to="/upload" className="btn-primary mt-5">Upload a model</Link>
          </div>
        )}
      </section>

      {collections.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="container-page py-12 md:py-16">
            <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold">Featured collections</h2><Link to="/collections" className="text-sm font-semibold text-brand-strong hover:underline">All collections</Link></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{collections.map((c) => <CollectionCard key={c.id} collection={c} />)}</div>
          </div>
        </section>
      )}

      <section className="border-y border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Browse by category</h2>
            <Link to="/models" className="text-sm font-semibold text-brand-strong hover:underline">All categories</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {(categories.length ? categories.slice(0, 12) : []).map((category) => (
              <Link key={category.id} to={`/models?category=${encodeURIComponent(category.slug)}`} className="group card-line flex items-center gap-3 p-4 hover:border-line-strong">
                <Box className="h-5 w-5 text-brand" />
                <span className="text-sm font-semibold text-ink group-hover:underline">{category.name}</span>
                <span className="ml-auto text-[11px] text-muted">{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {latest.length > 4 && (
        <section className="container-page py-12 md:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Latest uploads</h2>
            <Link to="/models?sort=newest" className="text-sm font-semibold text-brand-strong hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{latest.slice(0, 8).map((m) => <ModelCard key={m.id} model={m} />)}</div>
        </section>
      )}

      {creators.length > 0 && (
        <section className="container-page py-12 md:py-16">
          <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold">Top creators</h2><Link to="/models" className="text-sm font-semibold text-brand-strong hover:underline">Explore models</Link></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {creators.map((c) => (
              <Link key={c.username} to={`/u/${c.username}`} className="card-line flex items-center gap-3 p-3 hover:border-line-strong">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-bold text-brand-strong">{c.displayName.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-semibold text-ink">{c.displayName}</span><span className="block text-[10px] text-muted">{c.modelCount} models · {c.downloads} downloads</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page pb-12">
        <div className="grid gap-6 border border-line bg-surface p-6 md:grid-cols-4 md:p-8">
          {[
            ['Models', stats?.models ?? 0],
            ['Downloads', stats?.downloads ?? 0],
            ['Files', stats?.files ?? 0],
            ['Members', stats?.users ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <p className="font-display text-3xl font-bold text-ink">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
