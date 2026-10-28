import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-bold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input-line ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`input-line min-h-24 py-2 ${props.className ?? ''}`} />
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div className="border border-danger/30 bg-danger/5 px-3 py-2 text-xs leading-5 text-danger">{children}</div>
}

export function SuccessBox({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <div className="border border-success/30 bg-success/5 px-3 py-2 text-xs leading-5 text-ink">{children}</div>
}
