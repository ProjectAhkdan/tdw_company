import type { CSSProperties } from 'react'

export const adminInputStyle: CSSProperties = {
  background: '#fff',
  border: '1.5px solid #E5E7EB',
  borderRadius: 10,
  color: '#111827',
  height: 40,
  padding: '0 14px',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s',
}

export const adminTextareaStyle: CSSProperties = {
  ...adminInputStyle,
  height: 'auto',
  padding: '10px 14px',
  resize: 'vertical',
  lineHeight: 1.6,
}

export const adminSelectStyle: CSSProperties = {
  ...adminInputStyle,
  cursor: 'pointer',
  appearance: 'none' as CSSProperties['appearance'],
}
