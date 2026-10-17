/** The gate: two bars, a 4u slot, one token not yet let through. Geometry is fixed by the brand kit. */
export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className="mark"
    >
      <g fill="var(--mark-bar)">
        <path d="M4 8h13l13 48H17z" />
        <path d="M60 8H47L34 56h13z" />
      </g>
      <rect x="28" y="30" width="8" height="8" fill="var(--mark-token)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`wordmark ${className}`}>velyr</span>;
}
