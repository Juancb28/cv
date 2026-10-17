export function SpainFlag({ className = 'w-4 h-3' }) {
  return (
    <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] shrink-0 border border-black/10 dark:border-white/10 ${className}`}>
      <svg viewBox="0 0 750 500" className="w-full h-full block" aria-hidden="true">
        <rect width="750" height="500" fill="#c60b1e" />
        <rect width="750" height="250" y="125" fill="#ffc400" />
        {/* Stylized coat of arms marker */}
        <g transform="translate(180, 250)">
          <rect x="-30" y="-45" width="60" height="90" rx="10" fill="#c60b1e" opacity="0.8" />
          <circle cx="0" cy="0" r="16" fill="#ffc400" />
          <path d="M-22,-45 L22,-45 L15,-60 L-15,-60 Z" fill="#b8860b" />
        </g>
      </svg>
    </span>
  );
}

export function USFlag({ className = 'w-4 h-3' }) {
  return (
    <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] shrink-0 border border-black/10 dark:border-white/10 ${className}`}>
      <svg viewBox="0 0 741 390" className="w-full h-full block" aria-hidden="true">
        {/* Background stripes */}
        <rect width="741" height="390" fill="#b22234" />
        <path
          d="M0,45H741M0,105H741M0,165H741M0,225H741M0,285H741M0,345H741"
          stroke="#fff"
          strokeWidth="30"
        />
        {/* Canton */}
        <rect width="296" height="210" fill="#3c3b6e" />
        {/* Star grid */}
        <g fill="#fff">
          <circle cx="45" cy="35" r="7" />
          <circle cx="115" cy="35" r="7" />
          <circle cx="185" cy="35" r="7" />
          <circle cx="255" cy="35" r="7" />
          <circle cx="80" cy="70" r="7" />
          <circle cx="150" cy="70" r="7" />
          <circle cx="220" cy="70" r="7" />
          <circle cx="45" cy="105" r="7" />
          <circle cx="115" cy="105" r="7" />
          <circle cx="185" cy="105" r="7" />
          <circle cx="255" cy="105" r="7" />
          <circle cx="80" cy="140" r="7" />
          <circle cx="150" cy="140" r="7" />
          <circle cx="220" cy="140" r="7" />
          <circle cx="45" cy="175" r="7" />
          <circle cx="115" cy="175" r="7" />
          <circle cx="185" cy="175" r="7" />
          <circle cx="255" cy="175" r="7" />
        </g>
      </svg>
    </span>
  );
}

