import { Box, Check, ChevronLeft, ChevronRight, Crop, Download, Grid3X3, Home, ImagePlus, Loader2, Maximize2, Minus, Move3D, Palette, Plus, RotateCw, Save, Sun, X } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import { disposeObject, fitCameraToObject, loadModelObject, normalizeModel } from '../../lib/load-model'
import { formatBytes } from '../../lib/api'
import { fileUrl, type Model, type ModelFile } from '../../lib/models'
import { authAtom } from '../../atoms/auth'

type Background = 'white' | 'canvas' | 'dark'
type Selection = { x: number; y: number; w: number; h: number }

export default function ModelViewer({
  model,
  files,
  initialFileId,
  onClose,
  canEdit = false,
  onImageSaved,
}: {
  model: Model
  files: ModelFile[]
  initialFileId?: string
  onClose: () => void
  canEdit?: boolean
  onImageSaved?: () => void | Promise<void>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const currentRef = useRef<THREE.Group | null>(null)
  const gridRef = useRef<THREE.GridHelper | null>(null)
  const rafRef = useRef(0)
  const [fileId, setFileId] = useState(initialFileId || files.find((f) => f.isPreview)?.id || files[0]?.id || '')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [wireframe, setWireframe] = useState(false)
  const [grid, setGrid] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [background, setBackground] = useState<Background>('white')
  const [dims, setDims] = useState('')
  const [sizeText, setSizeText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [captureMode, setCaptureMode] = useState(false)
  const [selection, setSelection] = useState<Selection | null>(null)
  const dragStart = useRef<{ x: number; y: number; mode: 'move' | 'draw'; original?: Selection } | null>(null)
  const captureModeRef = useRef(false)
  const [auth] = useAtom(authAtom)

  useEffect(() => { captureModeRef.current = captureMode }, [captureMode])
  const currentFile = files.find((f) => f.id === fileId) ?? files[0]
  const idx = files.findIndex((f) => f.id === currentFile?.id)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000)
    camera.position.set(2, 2, 2)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.background = background === 'dark' ? '#1f2124' : background === 'canvas' ? '#f5f5f5' : '#ffffff'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    container.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x555555, 2.1)
    scene.add(hemi)
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(4, 7, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 1.1)
    fill.position.set(-5, 2, -4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffd6c2, 0.8)
    rim.position.set(0, -4, -3)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotateSpeed = 1.4
    controls.minDistance = 0.01
    controls.maxDistance = 5000

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    const resize = () => {
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const tick = () => {
      controls.update()
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (captureModeRef.current) {
          e.preventDefault()
          setCaptureMode(false)
          setSelection(null)
          return
        }
        onClose()
        return
      }
      if (captureModeRef.current) return
      if (e.key === 'ArrowRight' && files.length > 1) next()
      if (e.key === 'ArrowLeft' && files.length > 1) prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.style.background = ''
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      controls.dispose()
      if (currentRef.current) disposeObject(currentRef.current)
      gridRef.current?.geometry.dispose()
      ;(gridRef.current?.material as THREE.Material | undefined)?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!currentFile) return
    const xhr = new XMLHttpRequest()
    let cancelled = false
    setLoading(true)
    setProgress(0)
    setError('')
    xhr.open('GET', fileUrl(model.id, currentFile.id))
    xhr.withCredentials = true
    xhr.responseType = 'arraybuffer'
    xhr.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)) }
    xhr.onload = async () => {
      if (cancelled) return
      if (xhr.status < 200 || xhr.status >= 300) {
        setError('Could not download this file.')
        setLoading(false)
        return
      }
      try {
        const object = await loadModelObject(xhr.response, currentFile.format)
        if (cancelled) { disposeObject(object); return }
        const scene = sceneRef.current
        if (!scene) return
        if (currentRef.current) { scene.remove(currentRef.current); disposeObject(currentRef.current) }
        const wrapper = normalizeModel(object, currentFile.format)
        scene.add(wrapper)
        currentRef.current = wrapper
        applyWireframe(wrapper, wireframe)
        const box = new THREE.Box3().setFromObject(wrapper)
        const size = box.getSize(new THREE.Vector3())
        setDims(`${fmt(size.x)} × ${fmt(size.y)} × ${fmt(size.z)} mm`)
        setSizeText(formatBytes(currentFile.sizeBytes))
        if (gridRef.current) { scene.remove(gridRef.current); gridRef.current.geometry.dispose(); (gridRef.current.material as THREE.Material).dispose(); gridRef.current = null }
        const gridSize = Math.max(size.x, size.z, 1) * 3
        const helper = new THREE.GridHelper(gridSize, 20, 0xd0d0d0, 0xe5e5e5)
        helper.position.y = box.min.y - 0.01
        helper.visible = grid
        gridRef.current = helper
        scene.add(helper)
        if (cameraRef.current && controlsRef.current) fitCameraToObject(cameraRef.current, controlsRef.current, wrapper)
        if (rendererRef.current && cameraRef.current) rendererRef.current.render(scene, cameraRef.current)
        setLoading(false)
      } catch (err) {
        if (!cancelled) { setError(err instanceof Error ? err.message : 'This file could not be previewed.'); setLoading(false) }
      }
    }
    xhr.onerror = () => { if (!cancelled) { setError('Could not download this file.'); setLoading(false) } }
    xhr.send()
    return () => { cancelled = true; xhr.abort() }
  }, [currentFile?.id, model.id])

  useEffect(() => { if (currentRef.current) applyWireframe(currentRef.current, wireframe) }, [wireframe])
  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])
  useEffect(() => {
    if (gridRef.current) gridRef.current.visible = grid
  }, [grid])
  useEffect(() => {
    const scene = sceneRef.current
    const renderer = rendererRef.current
    if (!scene || !renderer) return
    const color = background === 'dark' ? '#1f2124' : background === 'canvas' ? '#f5f5f5' : '#ffffff'
    scene.background = new THREE.Color(color)
    renderer.setClearColor(color)
    renderer.domElement.style.background = color
    document.body.style.background = color
  }, [background])

  function next() { if (!files.length) return; const i = (idx + 1) % files.length; setFileId(files[i].id) }
  function prev() { if (!files.length) return; const i = (idx - 1 + files.length) % files.length; setFileId(files[i].id) }
  function home() { if (currentRef.current && cameraRef.current && controlsRef.current) fitCameraToObject(cameraRef.current, controlsRef.current, currentRef.current) }
  function captureBlob(region?: Selection | null): Promise<Blob | null> {
    const renderer = rendererRef.current
    if (!renderer || !sceneRef.current || !cameraRef.current) return Promise.resolve(null)
    renderer.render(sceneRef.current, cameraRef.current)
    const source = renderer.domElement
    if (!region || region.w < 2 || region.h < 2) {
      return new Promise((resolve) => source.toBlob(resolve, 'image/png'))
    }
    const scaleX = source.width / Math.max(source.clientWidth, 1)
    const scaleY = source.height / Math.max(source.clientHeight, 1)
    const sx = Math.max(0, Math.round(region.x * scaleX))
    const sy = Math.max(0, Math.round(region.y * scaleY))
    const sw = Math.max(1, Math.min(source.width - sx, Math.round(region.w * scaleX)))
    const sh = Math.max(1, Math.min(source.height - sy, Math.round(region.h * scaleY)))
    const out = document.createElement('canvas')
    out.width = sw
    out.height = sh
    const ctx = out.getContext('2d')
    if (!ctx) return Promise.resolve(null)
    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh)
    return new Promise((resolve) => out.toBlob(resolve, 'image/png'))
  }
  function screenshot() {
    captureBlob().then((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${model.title.replace(/[^\w.-]+/g, '-')}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    })
  }
  function startCapture() {
    if (!canEdit) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Preferred gallery aspect is 4:3, centered. The user can drag the frame
    // to reposition it, or draw a new region outside the frame.
    const maxW = rect.width * 0.72
    const maxH = rect.height * 0.72
    let w = maxW
    let h = w * 0.75
    if (h > maxH) {
      h = maxH
      w = h / 0.75
    }
    setSelection({ x: (rect.width - w) / 2, y: (rect.height - h) / 2, w, h })
    setCaptureMode(true)
    setSaveError('')
    setSaveMessage('')
  }
  function cancelCapture() {
    setCaptureMode(false)
    setSelection(null)
    dragStart.current = null
  }
  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!captureMode) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, rect.width)
    const y = clamp(e.clientY - rect.top, 0, rect.height)
    const inside = !!selection && x >= selection.x && x <= selection.x + selection.w && y >= selection.y && y <= selection.y + selection.h
    if (inside && selection) {
      dragStart.current = { x, y, mode: 'move', original: { ...selection } }
    } else {
      dragStart.current = { x, y, mode: 'draw' }
      setSelection({ x, y, w: 0, h: 0 })
    }
  }
  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const start = dragStart.current
    if (!start) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, rect.width)
    const y = clamp(e.clientY - rect.top, 0, rect.height)
    if (start.mode === 'move' && start.original) {
      const o = start.original
      setSelection({
        ...o,
        x: clamp(o.x + (x - start.x), 0, rect.width - o.w),
        y: clamp(o.y + (y - start.y), 0, rect.height - o.h),
      })
    } else {
      setSelection({ x: Math.min(start.x, x), y: Math.min(start.y, y), w: Math.abs(x - start.x), h: Math.abs(y - start.y) })
    }
  }
  function pointerUp() {
    dragStart.current = null
  }
  async function saveSelection() {
    if (!canEdit || saving || !selection || selection.w < 8 || selection.h < 8) return
    setSaving(true)
    setSaveError('')
    setSaveMessage('')
    try {
      if (!auth.csrf) throw new Error('Sign in again to save an image.')
      const blob = await captureBlob(selection)
      if (!blob) throw new Error('Could not capture the selected area.')
      const fd = new FormData()
      fd.append('file', new File([blob], `${model.slug || model.id}-viewer.png`, { type: 'image/png' }))
      const res = await fetch(`/api/models/${model.id}/images`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-Token': auth.csrf },
        body: fd,
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error?.message || 'Could not save the image.')
      cancelCapture()
      setSaveMessage('Selected view saved to gallery')
      await onImageSaved?.()
      window.setTimeout(() => setSaveMessage(''), 2500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save the image.')
      window.setTimeout(() => setSaveError(''), 4000)
    } finally {
      setSaving(false)
    }
  }
  function fullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-white" style={{ background }}>
      <div className="absolute left-4 top-4 z-10 grid grid-cols-3 gap-1 border border-line bg-surface p-1 shadow-sm">
        <ToolButton label="Reset view" onClick={home}><Home className="h-4 w-4" /></ToolButton>
        <ToolButton label="Auto rotate" active={autoRotate} onClick={() => setAutoRotate((v) => !v)}><RotateCw className="h-4 w-4" /></ToolButton>
        <ToolButton label="Screenshot" onClick={screenshot}><Save className="h-4 w-4" /></ToolButton>
        <ToolButton label="Zoom in" onClick={() => cameraRef.current?.position.multiplyScalar(0.85)}><Plus className="h-4 w-4" /></ToolButton>
        <ToolButton label="Zoom out" onClick={() => cameraRef.current?.position.multiplyScalar(1.15)}><Minus className="h-4 w-4" /></ToolButton>
        <ToolButton label="Wireframe" active={wireframe} onClick={() => setWireframe((v) => !v)}><Move3D className="h-4 w-4" /></ToolButton>
        <ToolButton label="Grid" active={grid} onClick={() => setGrid((v) => !v)}><Grid3X3 className="h-4 w-4" /></ToolButton>
        <ToolButton label="Background" onClick={() => setBackground((b) => b === 'white' ? 'canvas' : b === 'canvas' ? 'dark' : 'white')}><Palette className="h-4 w-4" /></ToolButton>
        <ToolButton label="Fullscreen" onClick={fullscreen}><Maximize2 className="h-4 w-4" /></ToolButton>
        {canEdit && (
          <button
            type="button"
            onClick={startCapture}
            disabled={saving}
            className="col-span-3 mt-0.5 flex h-8 items-center justify-center gap-1.5 border-t border-line pt-1 text-[10px] font-semibold text-brand-strong hover:bg-brand-soft disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {saving ? 'Saving…' : 'Save to gallery'}
          </button>
        )}
      </div>

      <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-line bg-surface text-ink hover:bg-canvas" aria-label="Close 3D viewer"><X className="h-6 w-6" /></button>

      {captureMode && (
        <div className="absolute inset-0 z-40">
          <div
            className="absolute inset-0 cursor-crosshair touch-none"
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
          >
            {selection && (
              <div
                className="absolute cursor-move border-2 border-brand"
                style={{
                  left: selection.x, top: selection.y, width: selection.w, height: selection.h,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,.48)',
                }}
              >
                <span className="absolute -left-1 -top-1 h-2 w-2 bg-brand" />
                <span className="absolute -right-1 -top-1 h-2 w-2 bg-brand" />
                <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-brand" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-brand" />
              </div>
            )}
          </div>
          <div className="absolute left-1/2 top-4 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 border border-line bg-surface/95 px-4 py-2.5 shadow-sm">
            <Crop className="h-4 w-4 shrink-0 text-brand" />
            <span className="hidden text-xs text-muted sm:inline">Drag the 4:3 frame to move it · drag outside to redraw</span>
            <span className="text-xs text-muted sm:hidden">Drag frame to move</span>
            <button type="button" onClick={cancelCapture} className="btn-secondary !min-h-8 !px-3 !text-[11px]">Cancel</button>
            <button
              type="button"
              onClick={saveSelection}
              disabled={saving || !selection || selection.w < 8 || selection.h < 8}
              className="btn-primary !min-h-8 !px-3 !text-[11px] disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {saving ? 'Saving…' : 'Save image'}
            </button>
          </div>
        </div>
      )}

      {(saveMessage || saveError) && (
        <div className={`absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 border px-3 py-2 text-xs shadow-sm ${saveError ? 'border-danger/40 bg-danger/5 text-danger' : 'border-success/40 bg-success/10 text-ink'}`}>
          {saveError ? <X className="h-4 w-4" /> : <Check className="h-4 w-4 text-success" />}
          {saveError || saveMessage}
        </div>
      )}

      {files.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-4 text-muted hover:text-ink" aria-label="Previous file"><ChevronLeft className="h-8 w-8" /></button>
          <button onClick={next} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-4 text-muted hover:text-ink" aria-label="Next file"><ChevronRight className="h-8 w-8" /></button>
        </>
      )}

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
          <p className="text-xs font-medium text-muted">Loading {currentFile?.format.toUpperCase()}… {progress > 0 ? `${progress}%` : ''}</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
          <div className="max-w-sm border border-line bg-surface p-6 text-center">
            <Box className="mx-auto h-9 w-9 text-line-strong" />
            <p className="mt-3 font-display text-lg font-bold text-ink">Preview unavailable</p>
            <p className="mt-1 text-xs leading-5 text-muted">{error}</p>
            {currentFile && <a href={fileUrl(model.id, currentFile.id, true)} className="btn-primary mt-4"><Download className="h-4 w-4" /> Download file</a>}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-2 border border-line bg-surface/95 px-3 py-2 text-[11px] text-muted md:flex">
        <Sun className="h-3.5 w-3.5 text-brand" />
        <span>{dims || '—'}</span>
        <span>·</span><span>units assumed mm</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex max-w-[calc(100vw-2rem)] items-center gap-2 border border-line bg-surface/95 p-1.5 shadow-sm">
        <select value={currentFile?.id ?? ''} onChange={(e) => setFileId(e.target.value)} className="max-w-[240px] border-0 bg-transparent px-2 py-2 text-xs text-ink outline-none">
          {files.map((f) => <option key={f.id} value={f.id}>{f.filename}</option>)}
        </select>
        <span className="hidden text-[11px] text-muted sm:block">{sizeText}</span>
        {currentFile && <a href={fileUrl(model.id, currentFile.id, true)} className="p-2 text-muted hover:text-ink" aria-label="Download file"><Download className="h-4 w-4" /></a>}
        <button onClick={prev} disabled={files.length < 2} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label="Previous file"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={next} disabled={files.length < 2} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label="Next file"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

function ToolButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button title={label} aria-label={label} onClick={onClick} className={`flex h-9 w-9 items-center justify-center ${active ? 'bg-brand-soft text-brand-strong' : 'text-muted hover:bg-canvas hover:text-ink'}`}>{children}</button>
}

function applyWireframe(root: THREE.Object3D, wireframe: boolean) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) if (mat && 'wireframe' in mat) (mat as THREE.MeshStandardMaterial).wireframe = wireframe
  })
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function fmt(n: number) {
  return n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)
}
