import { Bookmark, Box, Download, Heart, Star } from 'lucide-react'
import { Link } from 'react-router'
import { displayCount, imageUrl, modelUrl, type Model } from '../lib/models'

export function ModelCard({ model }: { model: Model }) {
  const cover = model.coverImageId ? imageUrl(model.id, model.coverImageId, 'thumb') : ''
  return (
    <article className="group card-line flex h-full flex-col overflow-hidden">
      <Link to={modelUrl(model)} className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-strong">
          {model.ownerName.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-ink">{model.ownerName}</span>
          <span className="block truncate text-[10px] text-muted">@{model.ownerUsername}</span>
        </span>
      </Link>
      <Link to={modelUrl(model)} className="relative block aspect-[4/3] overflow-hidden bg-canvas">
        {cover ? (
          <img src={cover} alt={model.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#fff1ea,#f5f5f5)]">
            <Box className="h-12 w-12 text-brand/50" strokeWidth={1.1} />
          </div>
        )}
        {model.status === 'draft' && (
          <span className="absolute left-2 top-2 bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Draft</span>
        )}
        {model.imageCount > 1 && (
          <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {Array.from({ length: Math.min(model.imageCount, 5) }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-white shadow" />)}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link to={modelUrl(model)} className="line-clamp-2 text-[15px] font-semibold leading-[1.35] text-ink group-hover:underline">{model.title}</Link>
        <p className="mt-1 truncate text-[11px] text-muted">
          {model.categoryName || 'Uncategorized'}{model.tags?.length ? ` · ${model.tags.slice(0, 2).map((t) => t.name).join(', ')}` : ''}
        </p>
        <div className="mt-auto flex items-center gap-3 border-t border-line pt-2 text-[11px] text-muted">
          <span className={`flex items-center gap-1 ${model.liked ? 'text-brand-strong' : ''}`}><Heart className={`h-3.5 w-3.5 ${model.liked ? 'fill-current' : ''}`} />{displayCount(model.likeCount)}</span>
          <span className="flex items-center gap-1"><Star className={`h-3.5 w-3.5 ${model.ratingCount ? 'fill-current text-star' : ''}`} />{model.ratingCount ? model.ratingAvg.toFixed(1) : '—'}</span>
          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{displayCount(model.downloadCount)}</span>
          <span className={`ml-auto ${model.bookmarked ? 'text-brand-strong' : ''}`}><Bookmark className={`h-3.5 w-3.5 ${model.bookmarked ? 'fill-current' : ''}`} /></span>
        </div>
      </div>
    </article>
  )
}
