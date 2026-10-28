export type User = {
  id: string
  email?: string
  username: string
  displayName: string
  role: 'admin' | 'user'
  bio: string
  isActive: boolean
  emailVerifiedAt: number | null
  createdAt: number
  lastLoginAt?: number | null
}

export type SiteSettings = {
  siteName: string
  registrationEnabled: boolean
  emailVerificationEnabled: boolean
  requireLoginToBrowse: boolean
  maxUploadMB: number
  allowedFormats: string
  footerText: string
  version: string
}

export type AuthPayload = {
  user: User | null
  csrf: string
  settings: SiteSettings
  requiresVerification?: boolean
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const res = await fetch(path, { ...init, headers, credentials: 'same-origin' })
  if (res.status === 204) return undefined as T
  const text = await res.text()
  let body: any = null
  try { body = text ? JSON.parse(text) : null } catch { body = null }
  if (!res.ok) {
    const err = body?.error
    throw new ApiError(res.status, err?.code ?? 'request_failed', err?.message ?? `Request failed (${res.status}).`)
  }
  return body as T
}

export function post<T>(path: string, body: unknown, csrf?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (csrf) headers['X-CSRF-Token'] = csrf
  return api<T>(path, { method: 'POST', body: JSON.stringify(body), headers })
}

export function patch<T>(path: string, body: unknown, csrf?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (csrf) headers['X-CSRF-Token'] = csrf
  return api<T>(path, { method: 'PATCH', body: JSON.stringify(body), headers })
}

export function del<T>(path: string, csrf?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (csrf) headers['X-CSRF-Token'] = csrf
  return api<T>(path, { method: 'DELETE', headers })
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatDate(unix?: number | null): string {
  if (!unix) return '—'
  return new Date(unix * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
