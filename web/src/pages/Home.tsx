import { ArrowRight, Box, Download, Heart, Upload } from 'lucide-react'
import { Link } from 'react-router'

const categories = [
  '3D Printers',
  'Art & Design',
  'Gadgets',
  'Household',
  'Toys & Games',
  'Tabletop Miniatures',
]

function EmptyModelCard() {
  return (
    <div className="card-line overflow-hidden">
      <div className="flex h-7 items-center gap-2 border-b border-line px-3">
        <span className="h-4 w-4 rounded-full bg-line" />
        <span className="h-2 w-20 rounded-full bg-line" />
      </div>
      <div className="flex aspect-[4/3] items-center justify-center bg-canvas">
        <Box className="h-10 w-10 text-line-strong" strokeWidth={1.2} />
      </div>
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded-full bg-line" />
        <div className="h-2 w-1/2 rounded-full bg-line" />
        <div className="flex items-center gap-3 border-t border-line pt-2 text-[11px] text-muted">
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> 0</span>
          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> 0</span>
        </div>
      </div>
    </div>
  )
}

export function Home() {
  return (
    <main>
      <section className="container-page pt-0 md:pt-0">
        <div className="relative mt-4 overflow-hidden rounded-[2px] bg-ink">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,#fa6831_0%,transparent_34%),radial-gradient(circle_at_78%_70%,#a21caf33_0%,transparent_38%),linear-gradient(120deg,#1f2124_20%,#2a1813_100%)]" />
          <div className="relative grid min-h-[320px] items-center gap-8 px-6 py-12 md:min-h-[420px] md:grid-cols-[1.1fr_0.9fr] md:px-14">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">Your home model library</p>
              <h1 className="max-w-[620px] font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.035em] text-white md:text-6xl">
                Every model.
                <br />
                One place.
              </h1>
              <p className="mt-4 max-w-[440px] text-sm leading-6 text-white/70 md:text-base">
                Upload, organize, and preview your 3D files from any browser. Public by default, private when you need it.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/models" className="btn-primary">
                  Browse models <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/upload" className="inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-white/30 px-5 text-sm font-semibold text-white hover:border-white/70">
                  <Upload className="h-4 w-4" /> Upload a model
                </Link>
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
            <h2 className="text-2xl font-bold">Featured Models</h2>
            <p className="mt-1 text-sm text-muted">Admin picks will appear here once your library is populated.</p>
          </div>
          <Link to="/models" className="hidden text-sm font-semibold text-brand-strong hover:underline sm:block">
            Explore all models
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <EmptyModelCard key={i} />)}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          <h2 className="text-2xl font-bold">Browse by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category} to={`/models?category=${encodeURIComponent(category)}`} className="card-line group flex items-center gap-3 p-4 hover:border-line-strong">
                <Box className="h-5 w-5 text-brand" />
                <span className="text-sm font-semibold text-ink group-hover:underline">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-6 border border-line bg-surface p-6 md:grid-cols-4 md:p-8">
          {[
            ['Single binary', 'API, UI, and migrations in one file'],
            ['Local storage', 'SQLite metadata plus plain files'],
            ['3D preview', 'STL, 3MF, OBJ, PLY, GLB, GLTF'],
            ['Private by choice', 'Public, members-only, or private'],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-display text-lg font-bold text-ink">{title}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
