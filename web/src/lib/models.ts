import { ApiError, api } from './api'

export type Tag = { id: string; slug: string; name: string; count?: number }
export type Category = { id: string; slug: string; name: string; icon: string; count: number }
export type ModelFile = {
  id: string
  filename: string
  format: string
  sizeBytes: number
  sha256: string
  isPreview: boolean
  sortOrder: number
  createdAt: number
}
export type ModelAttachment = {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  sha256: string
  sortOrder: number
  createdAt: number
}
export type ModelImage = {
  id: string
  width: number
  height: number
  kind: 'upload' | 'render'
  sortOrder: number
  createdAt: number
}
export type Model = {
  id: string
  ownerId: string
  ownerUsername: string
  ownerName: string
  title: string
  slug: string
  description: string
  categoryId: string
  categoryName: string
  categorySlug: string
  license: string
  sourceUrl: string
  visibility: 'public' | 'members' | 'private'
  status: 'draft' | 'published'
  featured: boolean
  downloadCount: number
  likeCount: number
  bookmarkCount: number
  viewCount: number
  commentCount: number
  ratingCount: number
  ratingAvg: number
  collectionCount: number
  coverImageId: string
  imageCount: number
  fileFormats: string
  fileCount: number
  liked: boolean
  bookmarked: boolean
  myRating: number
  createdAt: number
  updatedAt: number
  publishedAt: number | null
  files?: ModelFile[]
  images?: ModelImage[]
  attachments?: ModelAttachment[]
  tags?: Tag[]
}
export type ModelPage = { items: Model[]; page: number; perPage: number; total: number; totalPages: number }
export type ModelDetail = { model: Model; canEdit: boolean }

export function imageUrl(modelId: string, imageId: string, variant: 'thumb' | 'large' | 'original' = 'large') {
  return `/api/models/${modelId}/images/${imageId}/${variant}`
}
export function fileUrl(modelId: string, fileId: string, download = false) {
  return `/api/models/${modelId}/files/${fileId}/content${download ? '?download=1' : ''}`
}
export function attachmentUrl(modelId: string, attachmentId: string, download = false) {
  return `/api/models/${modelId}/attachments/${attachmentId}/content${download ? '?download=1' : ''}`
}
export function modelUrl(m: Pick<Model, 'id' | 'slug'>) {
  return `/model/${m.id}/${m.slug}`
}
export function displayCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}
export function visibilityLabel(v: string): string {
  if (v === 'members') return 'Members'
  if (v === 'private') return 'Private'
  return 'Public'
}
export async function getModel(id: string): Promise<ModelDetail> {
  return api<ModelDetail>(`/api/models/${id}`)
}
export async function getModels(query: string): Promise<ModelPage> {
  return api<ModelPage>(`/api/models?${query}`)
}
export async function getCategories(): Promise<Category[]> {
  const r = await api<{ items: Category[] }>('/api/categories')
  return r.items
}
export async function getTags(q = ''): Promise<Tag[]> {
  const r = await api<{ items: Tag[] }>(`/api/tags?q=${encodeURIComponent(q)}`)
  return r.items
}
export { ApiError }
