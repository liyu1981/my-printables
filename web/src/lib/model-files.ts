export const MODEL_FORMATS = ['stl', '3mf', 'obj', 'ply', 'glb', 'gltf', 'gcode', 'step'] as const
export type ModelFormat = (typeof MODEL_FORMATS)[number]

const EXT_TO_FORMAT: Record<string, string> = {
  stl: 'stl',
  '3mf': '3mf',
  obj: 'obj',
  ply: 'ply',
  glb: 'glb',
  gltf: 'gltf',
  gcode: 'gcode',
  gco: 'gcode',
  g: 'gcode',
  step: 'step',
  stp: 'step',
}

export const MODEL_EXT = new Set(Object.keys(EXT_TO_FORMAT))
export const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp'])
export const ATTACHMENT_EXT = new Set(['pdf', 'txt', 'md', 'zip'])

export const MODEL_ACCEPT = [...MODEL_EXT].map((ext) => `.${ext}`).join(',')
export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
export const ATTACHMENT_ACCEPT = [...ATTACHMENT_EXT].map((ext) => `.${ext}`).join(',')

export const MODEL_FORMAT_LABEL = 'STL · 3MF · OBJ · PLY · GLB · GLTF · GCODE · STEP'
export const IMAGE_FORMAT_LABEL = 'JPEG · PNG · WebP'
export const ATTACHMENT_FORMAT_LABEL = 'PDF · TXT · MD · ZIP'

export const SLICER_FORMATS = new Set(['stl', '3mf', 'obj', 'step'])

export function extensionOf(name: string): string {
  return name.toLowerCase().split('.').pop() ?? ''
}

export function formatOf(filename: string): string {
  const ext = extensionOf(filename)
  return EXT_TO_FORMAT[ext] ?? ext
}

export function isModelFile(name: string): boolean {
  return MODEL_EXT.has(extensionOf(name))
}

export function isImageFile(name: string): boolean {
  return IMAGE_EXT.has(extensionOf(name))
}

export function isAttachmentFile(name: string): boolean {
  return ATTACHMENT_EXT.has(extensionOf(name))
}
