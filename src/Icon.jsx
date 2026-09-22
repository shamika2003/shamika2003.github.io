/** Lightweight Lucide-style SVG icons. No font files or icon dependencies. */
const shapes = {
  'arrow-up-right': <><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
  'arrow-down': <><path d="M12 4v16"/><path d="m5 13 7 7 7-7"/></>,
  'arrow-right': <><path d="M4 12h16"/><path d="m13 5 7 7-7 7"/></>,
  'arrow-up': <><path d="M12 20V4"/><path d="m5 11 7-7 7 7"/></>,
  'github': <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3"/><path d="M9 22v-3.9a4.7 4.7 0 0 1-1.6-.9c-2.9-.4-4.6-2.5-4.6-5.5 0-1.2.4-2.3 1.1-3.2-.3-1-.2-2.2.2-3.2 0 0 1.3-.4 3.5 1.6a12.4 12.4 0 0 1 6.8 0c2.2-2 3.5-1.6 3.5-1.6.4 1 .5 2.2.2 3.2.7.9 1.1 2 1.1 3.2 0 3-1.7 5.1-4.6 5.5-.5.4-1 .7-1.6.9V22"/></>,
  'linkedin': <><rect x="2.5" y="2.5" width="19" height="19" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-7M11 13.5a3.5 3.5 0 0 1 7 0V17"/></>,
  'mail': <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  'sun': <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
  'moon': <path d="M20.8 13A9 9 0 0 1 11 3.2a9 9 0 1 0 9.8 9.8Z"/>,
  'menu': <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  'close': <><path d="M18 6 6 18M6 6l12 12"/></>,
  'code': <><path d="m8 17-5-5 5-5m8 10 5-5-5-5m-3-13-4 20"/></>,
  'briefcase': <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0"/></>,
  'graduation': <><path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c4 3 8 3 12 0v-5M22 10v7"/></>,
  'download': <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></>,
  'external': <><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v6H5V5h6"/></>,
  'send': <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  'minus': <path d="M5 12h14"/>,
  'refresh-ccw': <><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M8 16H3v5"/></>,
  'check': <path d="m5 12 4 4L19 6"/>,
  'circle': <circle cx="12" cy="12" r="8"/>,
}
export default function Icon({ name, size = 18, className = '', strokeWidth = 1.8 }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[name] || shapes['circle']}</svg>
}
