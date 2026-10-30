const MODEL_EXT = new Set(['stl', '3mf', 'obj', 'ply', 'glb', 'gltf', 'gcode', 'gco', 'g', 'step', 'stp'])
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp'])
const ATTACHMENT_EXT = new Set(['pdf', 'txt', 'md', 'zip'])

export type ImportCandidate = {
  id: string
  path: string
  name: string
  models: File[]
  images: File[]
  attachments: File[]
}

function ext(name: string): string {
  return name.toLowerCase().split('.').pop() ?? ''
}

function classify(file: File): 'model' | 'image' | 'attachment' | null {
  const e = ext(file.name)
  if (MODEL_EXT.has(e)) return 'model'
  if (IMAGE_EXT.has(e)) return 'image'
  if (ATTACHMENT_EXT.has(e)) return 'attachment'
  return null
}

function makeCandidate(path: string, files: File[]): ImportCandidate | null {
  const models: File[] = []
  const images: File[] = []
  const attachments: File[] = []
  for (const file of files) {
    const kind = classify(file)
    if (kind === 'model') models.push(file)
    else if (kind === 'image') images.push(file)
    else if (kind === 'attachment') attachments.push(file)
  }
  if (models.length === 0) return null
  const name = path.split('/').filter(Boolean).pop() || 'Imported model'
  return { id: path || name, path: path || name, name, models, images, attachments }
}

/** Recursively walk a File System Access API directory handle. */
export async function scanDirectoryHandle(root: any): Promise<ImportCandidate[]> {
  const out: ImportCandidate[] = []
  async function walk(dir: any, parent: string): Promise<void> {
    const path = parent ? `${parent}/${dir.name}` : dir.name
    const direct: File[] = []
    const children: any[] = []
    for await (const [, entry] of dir.entries()) {
      if (entry.kind === 'directory') {
        children.push(entry)
      } else if (entry.kind === 'file') {
        if (entry.name.startsWith('.')) continue
        try {
          direct.push(await entry.getFile())
        } catch {
          // Skip files that cannot be read (permissions, deleted, etc.).
        }
      }
    }
    const candidate = makeCandidate(path, direct)
    if (candidate) out.push(candidate)
    for (const child of children.sort((a, b) => a.name.localeCompare(b.name))) {
      await walk(child, path)
    }
  }
  await walk(root, '')
  return out
}

/** Fallback for browsers without showDirectoryPicker (e.g. plain HTTP LAN). */
export function scanDirectoryFiles(files: File[]): ImportCandidate[] {
  const groups = new Map<string, File[]>()
  for (const file of files) {
    const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name
    const parts = relative.split('/')
    if (parts.some((p) => p.startsWith('.'))) continue
    parts.pop()
    const path = parts.join('/') || file.name
    const list = groups.get(path) ?? []
    list.push(file)
    groups.set(path, list)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, group]) => makeCandidate(path, group))
    .filter((c): c is ImportCandidate => c !== null)
}

export function supportedModel(name: string): boolean {
  return MODEL_EXT.has(ext(name))
}
