import { AlertCircle, Check, FileBox, FolderOpen, FolderSearch, Image as ImageIcon, Loader2, Paperclip, X } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { authAtom } from '../atoms/auth'
import { ApiError, formatBytes, patch, post } from '../lib/api'
import { scanDirectoryFiles, scanDirectoryHandle, type ImportCandidate } from '../lib/folder-import'
import { uploadWithProgress } from '../lib/upload'

export function FolderImport() {
  const [auth] = useAtom(authAtom)
  const [open, setOpen] = useState(false)
  const [candidates, setCandidates] = useState<ImportCandidate[]>([])
  const [index, setIndex] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [title, setTitle] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [imported, setImported] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [done, setDone] = useState(false)
  const fallbackInput = useRef<HTMLInputElement>(null)

  const current = candidates[index]
  const total = candidates.length
  const supportsPicker = typeof window !== 'undefined' && 'showDirectoryPicker' in window

  useEffect(() => {
    if (!current) return
    setTitle(current.name.slice(0, 120))
    setVisibility('public')
    setError('')
    setProgress('')
  }, [current?.id])

  function startQueue(items: ImportCandidate[]) {
    if (items.length === 0) {
      setScanError('No folders containing a supported 3D file were found.')
      return
    }
    setCandidates(items)
    setIndex(0)
    setImported(0)
    setSkipped(0)
    setDone(false)
    setError('')
    setOpen(true)
  }

  async function pickFolder() {
    setScanError('')
    if (!supportsPicker) {
      fallbackInput.current?.click()
      return
    }
    try {
      setScanning(true)
      const handle = await (window as unknown as { showDirectoryPicker: (opts?: any) => Promise<any> }).showDirectoryPicker({ mode: 'read' })
      const items = await scanDirectoryHandle(handle)
      startQueue(items)
    } catch (err) {
      if ((err as DOMException)?.name !== 'AbortError') {
        setScanError(err instanceof Error ? err.message : 'Could not read this folder.')
      }
    } finally {
      setScanning(false)
    }
  }

  function fallbackPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setScanning(true)
    try {
      startQueue(scanDirectoryFiles(files))
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Could not scan these files.')
    } finally {
      setScanning(false)
    }
  }

  function advance(skip: boolean) {
    if (skip) setSkipped((n) => n + 1)
    const next = index + 1
    if (next >= total) {
      setDone(true)
      setIndex(next)
    } else {
      setIndex(next)
    }
  }

  async function importCurrent() {
    if (!current || busy) return
    setBusy(true)
    setError('')
    let createdId = ''
    try {
      setProgress('Creating model…')
      const created = await post<{ model: { id: string } }>('/api/models', {
        title: title.trim() || current.name,
        description: `Imported from folder: ${current.path}`,
        visibility,
        status: 'draft',
      }, auth.csrf)
      createdId = created.model.id
      let n = 0
      for (const file of current.models) {
        n++
        setProgress(`Uploading 3D file ${n}/${current.models.length} · ${file.name}`)
        await uploadWithProgress(`/api/models/${createdId}/files`, file, auth.csrf, () => {})
      }
      for (let i = 0; i < current.images.length; i++) {
        setProgress(`Uploading image ${i + 1}/${current.images.length}…`)
        await uploadWithProgress(`/api/models/${createdId}/images`, current.images[i], auth.csrf, () => {})
      }
      for (let i = 0; i < current.attachments.length; i++) {
        setProgress(`Uploading attachment ${i + 1}/${current.attachments.length}…`)
        await uploadWithProgress(`/api/models/${createdId}/attachments`, current.attachments[i], auth.csrf, () => {})
      }
      setProgress('Publishing…')
      await patch(`/api/models/${createdId}`, { status: 'published' }, auth.csrf)
      setImported((n) => n + 1)
      advance(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Import failed.')
      if (createdId) {
        setError(`${err instanceof Error ? err.message : 'Import failed.'} A draft may have been created; finish or remove it from the model library.`)
      }
    } finally {
      setBusy(false)
    }
  }

  if (!auth.user) return null

  return (
    <section className="card-line mt-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink"><FolderSearch className="h-4 w-4 text-brand" /> Bulk import</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
            Scan a folder recursively. Each folder containing a supported 3D file becomes one model; subfolders are processed as separate models. You can review each item and skip it.
          </p>
        </div>
        <button type="button" onClick={pickFolder} disabled={scanning} className="btn-secondary">
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
          {scanning ? 'Scanning…' : 'Scan folder'}
        </button>
        <input
          ref={fallbackInput}
          type="file"
          multiple
          className="hidden"
          onChange={fallbackPicked}
          {...({ webkitdirectory: '', directory: '' } as any)}
        />
      </div>
      {!supportsPicker && <p className="mt-2 text-[11px] text-muted">This browser uses the directory-upload fallback. Select the folder in the picker.</p>}
      {scanError && <div className="mt-3 flex items-start gap-2 border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{scanError}</div>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Import folder</h3>
                <p className="text-[11px] text-muted">{done ? `${imported} imported · ${skipped} skipped` : `Item ${Math.min(index + 1, total)} of ${total} · ${current?.path ?? ''}`}</p>
              </div>
              <button type="button" onClick={() => { if (!busy) setOpen(false) }} disabled={busy} className="p-1 text-muted hover:text-ink" aria-label="Close import"><X className="h-5 w-5" /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {done ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15"><Check className="h-7 w-7 text-success" /></span>
                  <h4 className="mt-4 font-display text-xl font-bold text-ink">Folder import complete</h4>
                  <p className="mt-1 text-sm text-muted">{imported} model{imported === 1 ? '' : 's'} imported, {skipped} skipped.</p>
                  <button type="button" className="btn-primary mt-6" onClick={() => setOpen(false)}>Close</button>
                </div>
              ) : current ? (
                <div>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="min-w-[220px] flex-1"><span className="mb-1.5 block text-[12px] font-bold text-ink">Model title</span><input className="input-line" value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} /></label>
                    <label><span className="mb-1.5 block text-[12px] font-bold text-ink">Visibility</span><select className="input-line !w-auto" value={visibility} onChange={(e) => setVisibility(e.target.value)} disabled={busy}><option value="public">Public</option><option value="members">Members only</option><option value="private">Private</option></select></label>
                  </div>
                  <p className="mt-3 break-all rounded-[2px] bg-canvas px-2 py-1.5 text-[10px] text-muted">{current.path}</p>

                  <div className="mt-5 space-y-4">
                    <FileGroup icon={<FileBox className="h-4 w-4 text-brand" />} title={`3D files (${current.models.length})`} files={current.models} />
                    <FileGroup icon={<ImageIcon className="h-4 w-4 text-brand" />} title={`Gallery images (${current.images.length})`} files={current.images} empty="No images; the model will use a placeholder cover." />
                    <FileGroup icon={<Paperclip className="h-4 w-4 text-brand" />} title={`Attachments (${current.attachments.length})`} files={current.attachments} empty="No attachments." />
                  </div>

                  {error && <div className="mt-4 flex items-start gap-2 border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{error}</div>}
                  {busy && (
                    <div className="mt-4 border border-line bg-canvas px-3 py-2">
                      <p className="text-xs font-medium text-ink">{progress}</p>
                      <div className="mt-2 h-1 overflow-hidden bg-line"><div className="h-full w-1/3 animate-pulse bg-brand" /></div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {!done && current && (
              <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
                <button type="button" onClick={() => advance(true)} disabled={busy} className="btn-secondary">Skip</button>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted">{imported} imported</span>
                  <button type="button" onClick={importCurrent} disabled={busy || !title.trim()} className="btn-primary">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {busy ? 'Importing…' : 'Import model'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function FileGroup({ icon, title, files, empty }: { icon: React.ReactNode; title: string; files: File[]; empty?: string }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-bold text-ink">{icon}{title}</h4>
      {files.length > 0 ? (
        <div className="mt-2 border border-line">
          {files.map((f, i) => <div key={`${f.name}-${i}`} className="flex items-center gap-2 border-b border-line px-2.5 py-2 text-[11px] last:border-0"><span className="min-w-0 flex-1 truncate text-text">{f.name}</span><span className="shrink-0 text-muted">{formatBytes(f.size)}</span></div>)}
        </div>
      ) : <p className="mt-1 text-[11px] text-muted">{empty}</p>}
    </div>
  )
}
