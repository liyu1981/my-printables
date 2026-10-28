import { Box, Maximize2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import { disposeObject, fitCameraToObject, loadModelObject, normalizeModel } from '../../lib/load-model'
import { fileUrl, type Model, type ModelFile } from '../../lib/models'

export default function ModelPreview({ model, file, onOpen }: { model: Model; file: ModelFile; onOpen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const currentRef = useRef<THREE.Group | null>(null)
  const rafRef = useRef(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f5f5f5')
    const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.01, 5000)
    camera.position.set(2, 2, 2)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor('#f5f5f5')
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.background = '#f5f5f5'
    container.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 2.1))
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
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.65
    controls.minDistance = 0.01
    controls.maxDistance = 5000

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    const resize = () => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      camera.aspect = w / h
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

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      controls.dispose()
      if (currentRef.current) disposeObject(currentRef.current)
      renderer.dispose()
      renderer.domElement.remove()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetch(fileUrl(model.id, file.id), { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error('Could not download this file.')
        return res.arrayBuffer()
      })
      .then((data) => loadModelObject(data, file.format))
      .then((object) => {
        if (cancelled) { disposeObject(object); return }
        const scene = sceneRef.current
        if (!scene) return
        if (currentRef.current) { scene.remove(currentRef.current); disposeObject(currentRef.current) }
        const wrapper = normalizeModel(object, file.format)
        scene.add(wrapper)
        currentRef.current = wrapper
        if (cameraRef.current && controlsRef.current) fitCameraToObject(cameraRef.current, controlsRef.current, wrapper, 1.45)
        if (rendererRef.current && cameraRef.current) rendererRef.current.render(scene, cameraRef.current)
        setLoading(false)
      })
      .catch((err) => {
        if (!cancelled) { setError(err instanceof Error ? err.message : 'Preview unavailable.'); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [model.id, file.id, file.format])

  return (
    <div ref={containerRef} className="relative h-full w-full touch-none" onDoubleClick={onOpen}>
      <div className="pointer-events-none absolute left-0 top-0 z-10 p-2">
        <span className="flex items-center gap-1 bg-ink/75 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white"><Box className="h-3 w-3 text-brand" /> 3D Preview</span>
      </div>
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-canvas/60">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-brand" />
          <span className="text-[11px] font-medium text-muted">Loading 3D preview…</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-canvas px-4 text-center">
          <Box className="h-8 w-8 text-line-strong" />
          <p className="text-xs font-semibold text-ink">Preview unavailable</p>
          <p className="max-w-xs text-[10px] text-muted">{error}</p>
          <button type="button" onClick={onOpen} className="btn-secondary !min-h-8 !px-3 !text-[11px]">Open full viewer</button>
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 left-2 z-10 bg-surface/90 px-2 py-1 text-[9px] text-muted">
        Drag to rotate · Scroll to zoom
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <button type="button" onClick={onOpen} className="flex items-center gap-1 bg-surface/95 px-2 py-1 text-[10px] font-semibold text-ink shadow-sm hover:bg-brand-soft" aria-label="Open fullscreen 3D viewer">
          <Maximize2 className="h-3 w-3" /> Full viewer
        </button>
      </div>
    </div>
  )
}
