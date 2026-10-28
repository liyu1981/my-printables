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
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
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
  controls.update()
}
