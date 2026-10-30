import { api, del, patch, post, put } from './api'
import type { Model } from './models'

export type Comment = {
  id: string
  modelId: string
  parentId?: string
  body: string
  userId: string
  username: string
  displayName: string
  createdAt: number
  updatedAt: number
  deleted: boolean
  replies?: Comment[]
}
export type CommentPage = { items: Comment[]; page: number; perPage: number; total: number; totalPages: number }
export type RatingSummary = { ratingAvg: number; ratingCount: number; myRating: number }
export type CollectionCover = { modelId: string; imageId: string }
export type Collection = {
  id: string
  ownerId: string
  ownerUsername: string
  ownerName: string
  name: string
  slug: string
  description: string
  visibility: 'public' | 'members' | 'private'
  modelCount: number
  createdAt: number
  updatedAt: number
  covers: CollectionCover[] | null
}
export type CollectionPage = { items: Collection[]; page: number; perPage: number; total: number; totalPages: number }
export type CollectionDetail = { collection: Collection; models: Model[]; canEdit: boolean }

export async function getComments(modelId: string, page = 1, sort: 'new' | 'old' = 'new'): Promise<CommentPage> {
  return api<CommentPage>(`/api/models/${modelId}/comments?page=${page}&sort=${sort}&perPage=20`)
}
export function postComment(modelId: string, body: string, csrf: string, parentId?: string) {
  return post<{ comment: Comment }>(`/api/models/${modelId}/comments`, { body, parentId }, csrf)
}
export function updateComment(id: string, body: string, csrf: string) {
  return patch<{ comment: Comment }>(`/api/comments/${id}`, { body }, csrf)
}
export function deleteComment(id: string, csrf: string) {
  return del(`/api/comments/${id}`, csrf)
}
export function rateModel(modelId: string, score: number, csrf: string) {
  return put<RatingSummary>(`/api/models/${modelId}/rating`, { score }, csrf)
}
export function unrateModel(modelId: string, csrf: string) {
  return del<RatingSummary>(`/api/models/${modelId}/rating`, csrf)
}
export async function getCollections(params = ''): Promise<CollectionPage> {
  return api<CollectionPage>(`/api/collections?${params}`)
}
export async function getCollection(id: string): Promise<CollectionDetail> {
  return api<CollectionDetail>(`/api/collections/${id}`)
}
export function createCollection(body: { name: string; description: string; visibility: string }, csrf: string) {
  return post<{ collection: Collection }>('/api/collections', body, csrf)
}
export function updateCollection(id: string, body: Record<string, unknown>, csrf: string) {
  return patch<{ collection: Collection }>(`/api/collections/${id}`, body, csrf)
}
export function deleteCollection(id: string, csrf: string) {
  return del(`/api/collections/${id}`, csrf)
}
export function getModelCollections(modelId: string) {
  return api<{ items: Collection[] }>(`/api/models/${modelId}/collections`)
}
export function addToCollection(collectionId: string, modelId: string, csrf: string) {
  return post(`/api/collections/${collectionId}/models/${modelId}`, {}, csrf)
}
export function removeFromCollection(collectionId: string, modelId: string, csrf: string) {
  return del(`/api/collections/${collectionId}/models/${modelId}`, csrf)
}
export function getMyCollections(username: string) {
  return getCollections(`owner=${encodeURIComponent(username)}&perPage=100`)
}
export function timeAgo(unix: number): string {
  const seconds = Math.max(1, Math.floor(Date.now() / 1000 - unix))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(unix * 1000).toLocaleDateString()
}
