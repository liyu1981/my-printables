import * as THREE from 'three'
import { GLTFLoader, OBJLoader, PLYLoader, STLLoader, ThreeMFLoader } from 'three-stdlib'

export function orangeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FA6831'),
    roughness: 0.55,
    metalness: 0.05,
    side: THREE.DoubleSide,
  })
}

export async function loadModelObject(data: ArrayBuffer, format: string): Promise<THREE.Object3D> {
  switch (format) {
    case 'stl': {
      const geometry = new STLLoader().parse(data)
      geometry.computeVertexNormals()
      return new THREE.Mesh(geometry, orangeMaterial())
    }
    case '3mf': {
      const group = new ThreeMFLoader().parse(data)
      applyOrange(group)
      return group
    }
    case 'obj': {
      const group = new OBJLoader().parse(new TextDecoder().decode(data))
      applyOrange(group)
      return group
    }
    case 'ply': {
      const geometry = new PLYLoader().parse(data)
      geometry.computeVertexNormals()
      return new THREE.Mesh(geometry, orangeMaterial())
    }
    case 'glb': {
      return await new Promise<THREE.Object3D>((resolve, reject) => {
        new GLTFLoader().parse(data, '', (gltf) => { applyOrange(gltf.scene); resolve(gltf.scene) }, reject)
      })
    }
    case 'gltf': {
      return await new Promise<THREE.Object3D>((resolve, reject) => {
        new GLTFLoader().parse(new TextDecoder().decode(data), '', (gltf) => { applyOrange(gltf.scene); resolve(gltf.scene) }, reject)
      })
    }
    case 'gcode':
      return parseGcode(data)
    case 'step':
      return loadStep(data)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const GCODE_MAX_SEGMENTS = 600000

function parseGcode(data: ArrayBuffer): THREE.Object3D {
  const text = new TextDecoder().decode(data)
  const positions: number[] = []
  const colors: number[] = []
  const extrusionColor = new THREE.Color('#FA6831')
  const travelColor = new THREE.Color('#A7ADB5')
  let x = 0, y = 0, z = 0, e = 0
  let absoluteXYZ = true
  let absoluteE = true
  let unitScale = 1
  let segments = 0
  let stopped = false

  function addSegment(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, extruding: boolean): boolean {
    if (segments >= GCODE_MAX_SEGMENTS) return false
    if (Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1) < 1e-9) return true
    positions.push(x1, y1, z1, x2, y2, z2)
    const c = extruding ? extrusionColor : travelColor
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b)
    segments++
    return segments < GCODE_MAX_SEGMENTS
  }

  for (const raw of text.split(/\r?\n/)) {
    if (stopped) break
    let line = raw
    const comment = line.indexOf(';')
    if (comment >= 0) line = line.slice(0, comment)
    line = line.replace(/\([^)]*\)/g, ' ').trim()
    if (!line) continue

    const words = new Map<string, number>()
    for (const match of line.matchAll(/([A-Za-z])\s*([-+]?(?:\d+\.?\d*|\.\d+))/g)) {
      words.set(match[1].toUpperCase(), Number.parseFloat(match[2]))
    }
    const g = words.get('G')
    if (g === 90) { absoluteXYZ = true; continue }
    if (g === 91) { absoluteXYZ = false; continue }
    if (g === 20) { unitScale = 25.4; continue }
    if (g === 21) { unitScale = 1; continue }
    if (g === 28) {
      if (!words.has('X') && !words.has('Y') && !words.has('Z')) { x = 0; y = 0; z = 0 }
      else {
        if (words.has('X')) x = 0
        if (words.has('Y')) y = 0
        if (words.has('Z')) z = 0
      }
      continue
    }
    if (g === 92) {
      if (words.has('X')) x = words.get('X')! * unitScale
      if (words.has('Y')) y = words.get('Y')! * unitScale
      if (words.has('Z')) z = words.get('Z')! * unitScale
      if (words.has('E')) e = words.get('E')! * unitScale
      continue
    }
    const m = words.get('M')
    if (m === 82) { absoluteE = true; continue }
    if (m === 83) { absoluteE = false; continue }
    if (g !== 0 && g !== 1 && g !== 2 && g !== 3) continue

    const coord = (key: string, current: number) => {
      const value = words.get(key)
      if (value === undefined) return current
      return absoluteXYZ ? value * unitScale : current + value * unitScale
    }
    const nx = coord('X', x)
    const ny = coord('Y', y)
    const nz = coord('Z', z)
    const ev = words.get('E')
    const ne = ev === undefined ? e : (absoluteE ? ev * unitScale : e + ev * unitScale)
    const extruding = g === 1 || g === 2 || g === 3 ? ne > e + 1e-7 : false

    if (g === 2 || g === 3) {
      const i = (words.get('I') ?? 0) * unitScale
      const j = (words.get('J') ?? 0) * unitScale
      if (Math.abs(i) < 1e-9 && Math.abs(j) < 1e-9) {
        if (!addSegment(x, y, z, nx, ny, nz, extruding)) stopped = true
      } else {
        const cx = x + i
        const cy = y + j
        const radius = Math.hypot(x - cx, y - cy)
        const startAngle = Math.atan2(y - cy, x - cx)
        let sweep = Math.atan2(ny - cy, nx - cx) - startAngle
        if (g === 2) {
          if (sweep >= 0) sweep -= Math.PI * 2
        } else if (sweep <= 0) {
          sweep += Math.PI * 2
        }
        const steps = Math.max(8, Math.ceil(Math.abs(sweep) / (Math.PI / 24)))
        let px = x, py = y, pz = z
        for (let step = 1; step <= steps; step++) {
          const t = step / steps
          const angle = startAngle + sweep * t
          const qx = cx + radius * Math.cos(angle)
          const qy = cy + radius * Math.sin(angle)
          const qz = z + (nz - z) * t
          if (!addSegment(px, py, pz, qx, qy, qz, extruding)) { stopped = true; break }
          px = qx; py = qy; pz = qz
        }
      }
    } else if (!addSegment(x, y, z, nx, ny, nz, extruding)) {
      stopped = true
    }

    x = nx; y = ny; z = nz; e = ne
  }

  if (positions.length === 0) throw new Error('No toolpath moves found in this G-code file')

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
  const group = new THREE.Group()
  group.add(new THREE.LineSegments(geometry, material))
  group.userData.gcode = true
  return group
}

let stepWorker: Worker | null = null

function loadStep(data: ArrayBuffer): Promise<THREE.Object3D> {
  const worker = stepWorker ??= new Worker(new URL('./step.worker.ts', import.meta.url), { type: 'module', name: 'myprintables-step' })
  const id = Math.floor(Math.random() * 1_000_000_000)
  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent<{ id: number; ok: boolean; meshes?: Array<{ positions: Float32Array; indices: Uint32Array }>; message?: string }>) => {
      if (event.data.id !== id) return
      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
      if (!event.data.ok) {
        reject(new Error(event.data.message || 'OpenCascade could not read this STEP file.'))
        return
      }
      const meshes = event.data.meshes ?? []
      if (meshes.length === 0) {
        reject(new Error('This STEP file has no usable solids or surfaces.'))
        return
      }
      const group = new THREE.Group()
      for (const mesh of meshes) {
        if (mesh.indices.length < 3) continue
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(mesh.positions, 3))
        geometry.setIndex(new THREE.BufferAttribute(mesh.indices, 1))
        geometry.computeVertexNormals()
        group.add(new THREE.Mesh(geometry, orangeMaterial()))
      }
      if (group.children.length === 0) reject(new Error('This STEP file has no usable geometry.'))
      else resolve(group)
    }
    const onError = (event: ErrorEvent) => {
      event.preventDefault()
      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
      reject(new Error('The STEP importer crashed. The model may be too complex.'))
    }
    worker.addEventListener('message', onMessage)
    worker.addEventListener('error', onError)
    worker.postMessage({ id, buffer: data }, [data])
  })
}

export function applyOrange(root: THREE.Object3D) {
  const mat = orangeMaterial()
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      mesh.material = mat
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

export function normalizeModel(object: THREE.Object3D, format: string): THREE.Group {
  const wrapper = new THREE.Group()
  wrapper.add(object)
  if (format !== 'glb' && format !== 'gltf') object.rotation.x = -Math.PI / 2
  wrapper.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(wrapper)
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)
  wrapper.updateMatrixWorld(true)
  return wrapper
}

export function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const mat = mesh.material
    if (Array.isArray(mat)) mat.forEach(disposeMaterial)
    else if (mat) disposeMaterial(mat)
  })
}

function disposeMaterial(mat: THREE.Material) {
  for (const value of Object.values(mat)) {
    if (value instanceof THREE.Texture) value.dispose()
  }
  mat.dispose()
}

export function fitCameraToObject(camera: THREE.PerspectiveCamera, controls: { target: THREE.Vector3; update: () => void }, object: THREE.Object3D, margin = 1.35) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 1)
  const fov = (camera.fov * Math.PI) / 180
  const dist = (maxDim / 2 / Math.tan(fov / 2)) * margin
  camera.position.set(dist * 0.85, dist * 0.7, dist * 0.95).add(center)
  camera.near = Math.max(maxDim / 1000, 0.01)
  camera.far = Math.max(dist * 20, 1000)
  camera.updateProjectionMatrix()
  controls.target.copy(center)
  camera.lookAt(center)
  controls.update()
}
