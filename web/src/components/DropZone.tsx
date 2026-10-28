import { useRef, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export function DropZone({
  accept,
  title,
  subtitle,
  icon,
  onFiles,
  multiple = true,
}: {
  accept: string
  title: string
  subtitle: string
  icon: ReactNode
  onFiles: (files: File[]) => void
  multiple?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)

  function openPicker() {
    inputRef.current?.click()
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    dragDepth.current = 0
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFiles(files)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
        dragDepth.current++
        setDragging(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'copy'
        setDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setDragging(false)
      }}
      onDrop={onDrop}
      className={cn(
        'mt-4 flex w-full cursor-pointer flex-col items-center border border-dashed px-4 py-8 text-center transition-colors',
        dragging ? 'border-brand bg-brand-soft/70' : 'border-line bg-canvas hover:border-brand',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          if (files.length) onFiles(files)
          e.target.value = ''
        }}
      />
      <span className={cn('flex flex-col items-center', dragging && 'scale-105')}>
        {icon}
        <span className="mt-2 text-sm font-semibold text-ink">{dragging ? 'Drop files here' : title}</span>
        <span className="mt-1 text-[11px] text-muted">{dragging ? 'Release to add them to the upload' : subtitle}</span>
      </span>
    </div>
  )
}
