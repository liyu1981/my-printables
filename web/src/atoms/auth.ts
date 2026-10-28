import { atom } from 'jotai'
import { api, type AuthPayload, type SiteSettings, type User } from '../lib/api'

export type AuthState = {
  user: User | null
  csrf: string
  settings: SiteSettings
  loaded: boolean
}

const emptySettings: SiteSettings = {
  siteName: 'MyPrintables',
  registrationEnabled: true,
  emailVerificationEnabled: false,
  requireLoginToBrowse: false,
  maxUploadMB: 1024,
  allowedFormats: 'stl,3mf,obj,ply,glb,gltf',
  footerText: 'Self-hosted 3D model library.',
  version: 'dev',
}

export const authAtom = atom<AuthState>({ user: null, csrf: '', settings: emptySettings, loaded: false })

export const refreshAuthAtom = atom(null, async (_get, set) => {
  try {
    const payload = await api<AuthPayload>('/api/auth/me')
    set(authAtom, { user: payload.user, csrf: payload.csrf, settings: payload.settings, loaded: true })
    return payload
  } catch {
    set(authAtom, (prev) => ({ ...prev, loaded: true }))
  }
})

export const applyAuthAtom = atom(null, (_get, set, payload: AuthPayload) => {
  set(authAtom, {
    user: payload.user,
    csrf: payload.csrf,
    settings: payload.settings,
    loaded: true,
  })
})
