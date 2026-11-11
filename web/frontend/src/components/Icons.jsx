// Bộ icon SVG nhỏ gọn, không cần cài thêm thư viện
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconSparkles({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
    </svg>
  )
}

export function IconBook({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

export function IconLayers({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 18l9 5 9-5" />
    </svg>
  )
}

export function IconTarget({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  )
}

export function IconChartPie({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3z" />
      <path d="M14 3a7 7 0 0 1 7 7h-7V3z" />
    </svg>
  )
}

export function IconSearch({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function IconChevronLeft({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  )
}

export function IconChevronRight({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function IconAlertCircle({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function IconInbox({ className = 'h-5 w-5', ...p }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...p}>
      <path d="M3 12h5l2 3h4l2-3h5" />
      <path d="M5 5h14l2 7v7H3v-7l2-7z" />
    </svg>
  )
}