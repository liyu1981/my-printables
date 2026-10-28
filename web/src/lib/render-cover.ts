import * as THREE from 'three'
import { disposeObject, fitCameraToObject, loadModelObject, normalizeModel } from './load-model'

export async function renderCover(file: File, format: string): Promise<Blob> {
  const data = await file.arrayBuffer()
  const object = normalizeModel(await loadModelObject(data, format), format)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#ffffff')
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
  scene.add(object)

  const width = 800
  const height = 600
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 5000)
  const target = { target: new THREE.Vector3(), update: () => {} }
  fitCameraToObject(camera, target, object, 1.45)
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.render(scene, camera)
  const blob = await new Promise<Blob | null>((resolve) => renderer.domElement.toBlob(resolve, 'image/png'))
  disposeObject(object)
  renderer.dispose()
  if (!blob) throw new Error('Could not render cover')
  return blob
}

export function formatOf(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() ?? ''
  if (ext === 'stl') return 'stl'
  if (ext === '3mf') return '3mf'
  if (ext === 'obj') return 'obj'
  if (ext === 'ply') return 'ply'
  if (ext === 'glb') return 'glb'
  if (ext === 'gltf') return 'gltf'
  return ext
}
