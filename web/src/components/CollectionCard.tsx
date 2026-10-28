import { Lock, Users } from 'lucide-react'
import { Link } from 'react-router'
import { imageUrl, visibilityLabel } from '../lib/models'
import type { Collection } from '../lib/social'

export function CollectionCard({ collection }: { collection: Collection }) {
  const covers = collection.covers ?? []
  return (
    <Link to={`/collections/${collection.id}/${collection.slug}`} className="group card-line flex h-full flex-col overflow-hidden">
      <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 gap-px bg-line">
        {[0, 1, 2, 3].map((i) => {
          const cover = covers[i]
          return cover ? <img key={i} src={imageUrl(cover.modelId, cover.imageId, 'thumb')} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div key={i} className="flex items-center justify-center bg-canvas"><span className="h-4 w-4 border border-line-strong" /></div>
        })}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-[15px] font-semibold text-ink group-hover:underline">{collection.name}</p>
          {collection.visibility !== 'public' && <span className="shrink-0 text-muted">{collection.visibility === 'private' ? <Lock className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}</span>}
        </div>
        <p className="mt-1 text-[11px] text-muted">by {collection.ownerName} · {collection.modelCount} model{collection.modelCount === 1 ? '' : 's'}</p>
        <p className="mt-auto pt-3 text-[10px] uppercase tracking-[0.1em] text-muted">{visibilityLabel(collection.visibility)} collection</p>
      </div>
    </Link>
  )
}
