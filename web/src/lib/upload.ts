import { ApiError } from './api'

export function uploadWithProgress<T = unknown>(url: string, file: File, csrf: string, onProgress: (n: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.withCredentials = true
    xhr.setRequestHeader('X-CSRF-Token', csrf)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let body: unknown = null
      try { body = JSON.parse(xhr.responseText) } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as T)
      else {
        const err = (body as { error?: { code?: string; message?: string } } | null)?.error
        reject(new ApiError(xhr.status, err?.code ?? 'upload_failed', err?.message ?? 'Upload failed.'))
      }
    }
    xhr.onerror = () => reject(new ApiError(0, 'network', 'Upload failed.'))
    const fd = new FormData()
    fd.append('file', file, file.name)
    xhr.send(fd)
  })
}
